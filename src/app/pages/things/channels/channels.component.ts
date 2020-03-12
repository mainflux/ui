import { Component, OnInit } from '@angular/core';

import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';

import { Channel } from 'app/common/interfaces/mainflux.interface';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { FsService } from 'app/common/services/fs/fs.service';
import { ConfirmationComponent } from 'app/shared/confirmation/confirmation.component';
import { DetailsComponent } from 'app/shared/details/details.component';

const defSearchBardMs: number = 100;

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss'],
})

export class ChannelsComponent implements OnInit {
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      details: {
        type: 'custom',
        renderComponent: DetailsComponent,
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        editable: false,
        addable: false,
        filter: false,
      },
      name: {
        title: 'Name',
        filter: false,
      },
      id: {
        title: 'ID',
        editable: false,
        addable: false,
        filter: false,
      },
    },
    pager: {
      display: true,
      perPage: 6,
    },
  };

  source: LocalDataSource = new LocalDataSource();
  channels: Channel[];

  chansNum = 0;

  offset = 0;
  limit = 100;

  searchTime = 0;
  columnChar = '|';

  constructor(
    private dialogService: NbDialogService,
    private channelsService: ChannelsService,
    private notificationsService: NotificationsService,
    private fsService: FsService,
  ) { }

  ngOnInit() {
    this.getChannels();
  }

  getChannels(name?: string): void {
    this.channelsService.getChannels(this.offset, this.limit, '', '', name).subscribe(
      (resp: any) => {
        this.channels = resp.channels;
        this.chansNum = resp.total;

        // Load and refresh ngx-admin table
        this.source.load(resp.channels);
        this.source.refresh();
      },
    );
  }

  onCreateConfirm(event): void {
    // close edditable row
    event.confirm.resolve();

    this.channelsService.addChannel(event.newData).subscribe(
      resp => {
        this.notificationsService.success('Channel successfully created', '');
        this.getChannels();
      },
    );
  }

  onEditConfirm(event): void {
    // close edditable row
    event.confirm.resolve();

    this.channelsService.editChannel(event.newData).subscribe(
      resp => {
        this.notificationsService.success('Channel successfully edited', '');
      },
    );
  }

  onDeleteConfirm(event): void {
    this.dialogService.open(ConfirmationComponent, { context: { type: 'channel' } }).onClose.subscribe(
      confirm => {
        if (confirm) {
          // close edit row
          event.confirm.resolve();

          this.channelsService.deleteChannel(event.data.id).subscribe(
            resp => {
              this.notificationsService.success('Channel successfully deleted', '');
            },
          );
        }
      },
    );
  }

  searchChannel(input) {
    const t = new Date().getTime();
    if ((t - this.searchTime) > defSearchBardMs) {
      this.getChannels(input);
      this.searchTime = t;
    }
  }

  onClickSave() {
    this.fsService.exportToCsv('mfx_channels.csv', this.channels);
  }

  onFileSelected(files: FileList) {
    if (files && files.length > 0) {
      const file: File = files.item(0);
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const csv: string = reader.result as string;
        const lines = csv.split('\n');
        const channels: Channel[] = [];

        lines.forEach( line => {
          const col = line.split(this.columnChar);
          const name = col[0];
          if (name !== '' && name !== '<empty string>') {
            let metadata = {};
            if (col[1] !== undefined) {
              try {
                metadata = JSON.parse(col[1]);
              } catch (e) {
                this.notificationsService.warn('Wrong metadata format', '');
              }
            }

            const chann = {
              name: name,
              metadata: metadata,
            };
            channels.push(chann);
          }
        });

        this.channelsService.addChannels(channels).subscribe(
          resp => {
            this.getChannels();
          },
        );
      };
    }
  }
}
