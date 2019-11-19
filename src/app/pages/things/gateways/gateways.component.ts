import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

import { LocalDataSource } from 'ng2-smart-table';

import { Gateway } from 'app/common/interfaces/models';
import { GatewaysService } from 'app/common/services/gateways/gateways.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { MessagesService } from 'app/common/services/messages/messages.service';

import { DetailsComponent } from 'app/shared/details/details.component';
import { ConfirmationComponent } from 'app/shared/confirmation/confirmation.component';

@Component({
  selector: 'ngx-gateways-component',
  templateUrl: './gateways.component.html',
  styleUrls: ['./gateways.component.scss'],
})
export class GatewaysComponent implements OnInit {
  offset = 0;
  limit = 20;
  total = 0;

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
        placeholder: 'Search name',
        filter: {
          placeholder: 'Search name',
        },
      },
      mac: {
        title: 'MAC',
        placeholder: 'Search MAC',
        type: 'text',
        editable: true,
        addable: true,
        filter: {
          config: {
            placeholder: 'Search MAC',
          },
        },
      },
      messages: {
        title: 'Messages',
        type: 'text',
        editable: 'false',
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
        type: 'text',
        editable: 'false',
        addable: false,
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (cell > 0) {
            return new Date(cell * 1000).toLocaleString();
          }
          return 'undefined';
        },
      },
      details: {
        title: 'Details',
        type: 'custom',
        renderComponent: DetailsComponent,
        valuePrepareFunction: (cell, row) => {
          row.type = 'gateway';
          return row;
        },
        editable: 'false',
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
  gateways: Gateway[];

  gwDataChanNumber = 0;
  gwCtrlChanNumber = 0;
  prefixLength = 3;

  constructor(
    private gatewaysService: GatewaysService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.getGateways();
    this.getGatewaysChannels();
  }

  getGatewaysChannels() {
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
  }

  getGateways(): void {
    this.gateways = [];

    this.gatewaysService.getGateways(this.offset, this.limit).subscribe(
      (resp: any) => {
        this.total = resp.total;

        resp.things.forEach(thing => {
          thing.mac = thing.metadata.mac;

          const dataChannelID: string = thing.metadata ? thing.metadata.dataChannelID : '';
          this.messagesService.getMessages(dataChannelID, thing.key).subscribe(
            (msgResp: any) => {
              if (msgResp.messages) {
                thing.seen = msgResp.messages[0].time;
                thing.messages = msgResp.total;
              }

              this.gateways.push(thing);
              this.source.load(this.gateways);
              this.source.refresh();
            },
          );
        });
      },
    );
  }


  validate(row: any): boolean {
    if (row.name === '' || row.name.length > 32) {
      this.notificationsService.warn(
        '', 'Name is required and must be maximum 32 characters long.');
      return false;
    }

    if (row.mac === '' || row.mac.length < 8) {
      this.notificationsService.warn(
        '', 'MAC is required and must be at least 8 characters long.');
      return false;
    }

    return true;
  }


  onCreateConfirm(event): void {
    // Form validation
    if (!this.validate(event.newData)) {
      return;
    }

    // close edditable row
    event.confirm.resolve();

    this.gatewaysService.addGateway(event.newData.name, event.newData.mac).subscribe(
      resp => {
        setTimeout(
          () => {
            this.getGateways();
            this.getGatewaysChannels();
          }, 3000,
        );
      },
    );
  }

  onEditConfirm(event): void {
    // Formulaire Validator
    if (!this.validate(event.newData)) {
      return;
    }

    // close edditable row
    event.confirm.resolve();

    const name = event.newData.name;
    const mac = event.newData.mac;
    const gw = event.newData;

    this.gatewaysService.editGateway(name, mac, gw).subscribe(
      resp => {
      },
    );
  }

  onDeleteConfirm(event): void {
    this.dialogService.open(ConfirmationComponent, { context: { type: 'gateway' } }).onClose.subscribe(
      confirm => {
        if (confirm) {
          event.confirm.resolve();

          const gw = this.gateways.find(g => {
            return g.id === event.data.id;
          });

          this.gatewaysService.deleteGateway(gw).subscribe(
            resp => {
            },
          );
        }
      },
    );
  }
}
