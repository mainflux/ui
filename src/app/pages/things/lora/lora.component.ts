import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

import { LocalDataSource } from 'ng2-smart-table';

import { LoraService } from 'app/common/services/lora/lora.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { ConfirmationComponent } from 'app/shared/confirmation/confirmation.component';
import { DetailsComponent } from 'app/shared/details/details.component';
import { MessagesService } from 'app/common/services/messages/messages.service';

const defSearchBardMs: number = 100;

@Component({
  selector: 'ngx-lora-component',
  templateUrl: './lora.component.html',
  styleUrls: ['./lora.component.scss'],
})
export class LoraComponent implements OnInit {
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
        title: 'Details',
        type: 'custom',
        renderComponent: DetailsComponent,
        valuePrepareFunction: (cell, row) => {
          row.type = 'lora';
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
      appID: {
        title: 'ApplicationID',
        editable: true,
        addable: true,
        filter: false,
      },
      devEUI: {
        title: 'DeviceEUI',
        editable: true,
        addable: true,
        filter: false,
      },
      messages: {
        title: 'Messages',
        editable: false,
        addable: false,
        filter: false,
        valuePrepareFunction: cell => {
          if (cell > 0) {
            return cell;
          }
          return '0';
        },
      },
      seen: {
        width: '20%',
        title: 'Last Seen',
        editable: false,
        addable: false,
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (cell > 0) {
            return new Date(cell * 1000).toLocaleString();
          }
          return ' undefined ';
        },
      },
    },
    pager: {
      display: true,
      perPage: 6,
    },
  };

  source: LocalDataSource = new LocalDataSource();

  loraDevices = [];
  loraDevsNumber = 0;
  loraAppsNumber = 0;

  offset = 0;
  limit = 20;

  searcTime = 0;

  constructor(
    private loraService: LoraService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.getLoraDevices();
  }

  getLoraDevices(name?: string): void {
    this.loraDevices = [];

    this.loraService.getDevices(this.offset, this.limit, name).subscribe(
      (resp: any) => {
        this.loraDevsNumber = resp.total;

        resp.things.forEach(thing => {
          thing.devEUI = thing.metadata.lora.devEUI;
          thing.appID = thing.metadata.lora.appID;

          const chanID: string = thing.metadata ? thing.metadata.channelID : '';
          this.messagesService.getMessages(chanID, thing.key, thing.id).subscribe(
            (msgResp: any) => {
              if (msgResp.messages) {
                thing.seen = msgResp.messages[0].time;
                thing.messages = msgResp.total;
              }

              this.loraDevices.push(thing);
              this.source.load(this.loraDevices);
              this.source.refresh();
            },
          );
        });
      },
    );
  }

  onCreateConfirm(event): void {
    // Check appID and devEUI
    if (event.newData.devEUI !== '' && event.newData.appID !== '') {
      // close create row
      event.confirm.resolve();

      this.loraService.addDevice(event.newData).subscribe(
        resp => {
          setTimeout(
            () => {
              this.getLoraDevices();
            }, 3000,
          );
        },
      );
    } else {
      this.notificationsService.warn('AppID and DeviceEUI are required', '');
    }
  }

  onEditConfirm(event): void {
    // Check appID and devEUI
    if (event.newData.devEUI !== '' && event.newData.appID !== '') {
      // close edit row
      event.confirm.resolve();

      this.loraService.editDevice(event.newData).subscribe(
        resp => {
        },
      );
    } else {
      this.notificationsService.warn('AppID and DeviceEUI are required', '');
    }
  }

  onDeleteConfirm(event): void {
    this.dialogService.open(ConfirmationComponent, { context: { type: 'device' } }).onClose.subscribe(
      confirm => {
        if (confirm) {
          event.confirm.resolve();

          this.loraService.deleteDevice(event.data).subscribe(
            resp => {
              this.loraDevsNumber--;
            },
          );
        }
      },
    );
  }

  searchLora(input) {
    const t = new Date().getTime();
    if ((t - this.searcTime) > defSearchBardMs) {
      this.getLoraDevices(input);
      this.searcTime = t;
    }
  }

  onClickSave() {
  }

  onFileSelected(files: FileList) {
  }
}
