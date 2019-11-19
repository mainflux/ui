import { Component, OnInit } from '@angular/core';

import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';

import { Channel } from 'app/common/interfaces/models';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { GatewaysService } from 'app/common/services/gateways/gateways.service';
import { LoraService } from 'app/common/services/lora/lora.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { ConfirmationComponent } from 'app/shared/confirmation/confirmation.component';
import { DetailsComponent } from 'app/shared/details/details.component';

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
      name: {
        title: 'Name',
        type: 'string',
      },
      id: {
        title: 'ID',
        editable: 'false',
        addable: false,
        filter: false,
      },
      details: {
        title: 'Details',
        type: 'custom',
        renderComponent: DetailsComponent,
        valuePrepareFunction: (cell, row) => {
          row.type = 'channel';
          return row;
        },
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

  gwDataChanNumber = 0;
  gwCtrlChanNumber = 0;
  loraChanNumber = 0;
  totalChanNumber = 0;

  offset = 0;
  limit = 20;

  constructor(
    private dialogService: NbDialogService,
    private channelsService: ChannelsService,
    private gatewaysService: GatewaysService,
    private loraService: LoraService,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit() {
    this.getChannels();
    this.getChannelsStats();
  }

  getChannelsStats() {
    this.gatewaysService.getCtrlChannels(this.offset, this.limit).subscribe(
      (resp: any) => {
        this.gwCtrlChanNumber = resp.total;
      },
    );

    this.gatewaysService.getDataChannels(this.offset, this.limit).subscribe(
      (resp: any) => {
        this.gwDataChanNumber = resp.total;
      },
    );

    this.loraService.getChannels(this.offset, this.limit).subscribe(
      (resp: any) => {
        this.loraChanNumber = resp.total;
      },
    );
  }

  getChannels(): void {
    this.channelsService.getChannels(this.offset, this.limit).subscribe(
      (resp: any) => {
        this.channels = resp.channels;
        this.totalChanNumber = resp.total;

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
        this.getChannelsStats();
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
}
