import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';

import { Channel, PageFilters, TableConfig, TablePage } from 'app/common/interfaces/mainflux.interface';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { FsService } from 'app/common/services/fs/fs.service';
import { ConfirmationComponent } from 'app/shared/components/confirmation/confirmation.component';
import { ChannelsAddComponent } from './add/channels.add.component';

const defSearchBarMs: number = 100;

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
})

export class ChannelsComponent implements OnInit {
  tableConfig: TableConfig = {
    colNames: ['', '', '', 'Name', 'Type', 'ID', 'checkbox'],
    keys: ['edit', 'delete', 'details', 'name', 'type', 'id', 'checkbox'],
  };
  page: TablePage = {};
  pageFilters: PageFilters = {};

  searchTime = 0;
  columnChar = '|';

  selectedChannels: string[] = [];

  constructor(
    private router: Router,
    private dialogService: NbDialogService,
    private channelsService: ChannelsService,
    private notificationsService: NotificationsService,
    private fsService: FsService,
  ) { }

  ngOnInit() {
    this.getChannels();
  }

  getChannels(name?: string): void {
    this.page = {};

    this.pageFilters.name = name;
    this.channelsService.getChannels(this.pageFilters).subscribe(
      (resp: any) => {
        this.page = {
          offset: resp.offset,
          limit: resp.limit,
          total: resp.total,
          rows: resp.channels,
        };

        // Check if there is a type defined in the metadata
        this.page.rows.forEach( (chan: Channel) => {
          chan.type = chan.metadata ? chan.metadata.type : '';
        });
      },
    );
  }

  onChangePage(offset: number) {
    this.pageFilters.limit = offset;
    this.getChannels();
  }

  onChangeLimit(lim: number) {
    this.pageFilters.offset = 0;
    this.pageFilters.limit = lim;
    this.getChannels();
  }

  openAddModal() {
    this.dialogService.open(ChannelsAddComponent, { context: { action: 'Create' } }).onClose.subscribe(
      confirm => {
        if (confirm) {
          this.getChannels();
        }
      },
    );
  }

  openEditModal(row: any) {
    this.dialogService.open(ChannelsAddComponent, { context: { formData: row, action: 'Edit' } }).onClose.subscribe(
      confirm => {
        if (confirm) {
          this.getChannels();
        }
      },
    );
  }

  openDeleteModal(row: any) {
    this.dialogService.open(ConfirmationComponent, { context: { type: 'Channel' } }).onClose.subscribe(
      confirm => {
        if (confirm) {
          this.channelsService.deleteChannel(row.id).subscribe(
            resp => {
              this.page.rows = this.page.rows.filter((c: Channel) => c.id !== row.id);
              this.notificationsService.success('Channel successfully deleted', '');
            },
          );
        }
      },
    );
  }

  onOpenDetails(row: any) {
    if (row.id) {
      this.router.navigate([`${this.router.routerState.snapshot.url}/details/${row.id}`]);
    }
  }

  searchChannel(input) {
    const t = new Date().getTime();
    if ((t - this.searchTime) > defSearchBarMs) {
      this.pageFilters.offset = 0;
      this.getChannels(input);
      this.searchTime = t;
    }
  }

  onClickSave() {
    this.fsService.exportToJson('mfx_channels.txt', this.page.rows);
  }

  onCheckBox(rows: string[]) {
    this.selectedChannels = rows;
  }

  deleteChannels() {
    this.selectedChannels.forEach((channelID, i) => {
      this.channelsService.deleteChannel(channelID).subscribe(
        resp => {
          this.page.rows = this.page.rows.filter((c: Channel) => c.id !== channelID);
          if (i === this.selectedChannels.length - 1) {
            this.notificationsService.success('Channel(s) successfully deleted', '');
            this.getChannels();
          }
        },
      );
    });

  }

  onFileSelected(files: FileList) {
    if (files && files.length > 0) {
      const file: File = files.item(0);
      const reader: FileReader = new FileReader();
      reader.readAsText(file);

      reader.onload = () => {
        let channels: Channel[] = [];
        const text: string = reader.result as string;

        try {
          channels = JSON.parse(text);
        } catch (e) {
          this.notificationsService.warn('Wrong metadata format', '');
        }

        this.channelsService.addChannels(channels).subscribe(
          resp => {
            this.getChannels();
          },
        );
      };
    }
  }
}
