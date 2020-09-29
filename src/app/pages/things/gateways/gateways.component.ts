import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

import { LocalDataSource } from 'ng2-smart-table';

import { Gateway } from 'app/common/interfaces/gateway.interface';
import { GatewaysService } from 'app/common/services/gateways/gateways.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { FsService } from 'app/common/services/fs/fs.service';

import { DetailsComponent } from 'app/shared/details/details.component';
import { ConfirmationComponent } from 'app/shared/confirmation/confirmation.component';

const defSearchBardMs: number = 100;

@Component({
  selector: 'ngx-gateways-component',
  templateUrl: './gateways.component.html',
  styleUrls: ['./gateways.component.scss'],
})
export class GatewaysComponent implements OnInit {
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
          row.type = 'gateways';
          return row;
        },
        editable: 'false',
        addable: false,
        filter: false,
      },
      name: {
        title: 'Name',
        type: 'string',
        filter: false,
      },
      external_id: {
        title: 'External ID',
        type: 'text',
        editable: true,
        addable: true,
        filter: false,
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
        title: 'Last Seen',
        type: 'text',
        editable: false,
        addable: false,
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (cell > 0) {
            return new Date(cell * 1000).toLocaleString();
          }
          return 'undefined';
        },
      },
    },
    pager: {
      display: true,
      perPage: 6,
    },
  };

  source: LocalDataSource = new LocalDataSource();
  gateways: Gateway[];

  prefixLength = 3;

  offset = 0;
  limit = 20;
  total = 0;

  searchTime = 0;

  constructor(
    private gatewaysService: GatewaysService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
    private fsService: FsService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.getGateways();
  }

  getGateways(name?: string): void {
    this.gateways = [];

    this.gatewaysService.getGateways(this.offset, this.limit, name).subscribe(
      (resp: any) => {
        this.total = resp.total;

        resp.things.forEach(gw => {
          gw.external_id = gw.metadata.external_id;

          const data_channel_id: string = gw.metadata ? gw.metadata.data_channel_id : '';
          this.messagesService.getMessages(data_channel_id, gw.key, gw.id).subscribe(
            (msgResp: any) => {
              if (msgResp.messages) {
                gw.seen = msgResp.messages[0].time;
                gw.messages = msgResp.total;
              }

              this.gateways.push(gw);
              this.source.load(this.gateways);
              this.source.refresh();
            },
            err => {
              this.gateways.push(gw);
              this.source.load(this.gateways);
              this.source.refresh();
            },
          );
        });
      },
    );
  }


  validate(row: any): boolean {
    const gws = this.gateways.map(g => g.metadata.external_id);
    if (gws.includes(row.external_id)) {
      this.notificationsService.warn(
        'External ID already exist.', '');
      return false;
    }
    if (row.name === '' || row.name.length > 32) {
      this.notificationsService.warn(
        'Name is required and must be maximum 32 characters long.', '');
      return false;
    }

    if (row.external_id === '' || row.external_id.length < 8) {
      this.notificationsService.warn(
        'External ID is required and must be at least 8 characters long.', '');
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

    this.gatewaysService.addGateway(event.newData.name, event.newData.external_id).subscribe(
      resp => {
        setTimeout(
          () => {
            this.getGateways();
          }, 3000,
        );
      },
    );
  }

  onEditConfirm(event): void {
    // Check if the row have been modified
    const extIDs = this.gateways.map(g => g.metadata.external_id);
    const names = this.gateways.map(g => g.name);
    if (extIDs.includes(event.newData.external_id) && names.includes(event.newData.name)) {
      // close edditable row
      event.confirm.resolve();
      return;
    }

    // Formulaire Validator
    if (!this.validate(event.newData)) {
      return;
    }

    // close edditable row
    event.confirm.resolve();

    const name = event.newData.name;
    const external_id = event.newData.external_id;
    const gw = event.newData;

    this.gatewaysService.editGateway(name, external_id, gw).subscribe(
      resp => {
        this.getGateways();
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

  searchGW(input) {
    const t = new Date().getTime();
    if ((t - this.searchTime) > defSearchBardMs) {
      this.getGateways(input);
      this.searchTime = t;
    }
  }

  onClickSave() {
    this.fsService.exportToCsv('gateways.csv', this.gateways);
  }

  onFileSelected(files: FileList) {
  }
}
