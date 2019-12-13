import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

import { LocalDataSource } from 'ng2-smart-table';

import { OpcuaService } from 'app/common/services/opcua/opcua.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { ConfirmationComponent } from 'app/shared/confirmation/confirmation.component';
import { DetailsComponent } from 'app/shared/details/details.component';
import { MessagesService } from 'app/common/services/messages/messages.service';

@Component({
  selector: 'ngx-opcua-component',
  templateUrl: './opcua.component.html',
  styleUrls: ['./opcua.component.scss'],
})
export class OpcuaComponent implements OnInit {
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
      serverURI: {
        title: 'Server URI',
        editable: true,
        addable: true,
        filter: true,
      },
      nodeID: {
        title: 'Node ID',
        editable: true,
        addable: true,
        filter: true,
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
          return ' undefined ';
        },
      },
      details: {
        title: 'Details',
        type: 'custom',
        renderComponent: DetailsComponent,
        valuePrepareFunction: (cell, row) => {
          row.type = 'opcua';
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

  opcuaNodes = [];

  offset = 0;
  limit = 20;

  constructor(
    private opcuaService: OpcuaService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.getOpcuaNodes();
  }

  getOpcuaNodes(): void {
    this.opcuaNodes = [];

    this.opcuaService.getNodes(this.offset, this.limit).subscribe(
      (resp: any) => {
        resp.things.forEach(node => {
          node.serverURI = node.metadata.opcua.serverURI;
          node.nodeID = node.metadata.opcua.nodeID;

          const chanID: string = node.metadata ? node.metadata.channelID : '';
          this.messagesService.getMessages(chanID, node.key).subscribe(
            (msgResp: any) => {
              if (msgResp.messages) {
                node.seen = msgResp.messages[0].time;
                node.messages = msgResp.total;
              }

              this.opcuaNodes.push(node);
              this.source.load(this.opcuaNodes);
              this.source.refresh();
            },
          );
        });
      },
    );
  }

  onCreateConfirm(event): void {
    // Check ServerURI and NodeID
    if (event.newData.serverURI !== '' && event.newData.nodeID !== '') {
      // close create row
      event.confirm.resolve();

      this.opcuaService.addNode(event.newData).subscribe(
        resp => {
          setTimeout(
            () => {
              this.getOpcuaNodes();
            }, 3000,
          );
        },
      );
    } else {
      this.notificationsService.warn('Server URI and Node ID are required', '');
    }
  }

  onEditConfirm(event): void {
    // Check ServerURI and NodeID
    if (event.newData.serverURI !== '' && event.newData.nodeID !== '') {
      // close edit row
      event.confirm.resolve();

      this.opcuaService.editNode(event.newData).subscribe();
    } else {
      this.notificationsService.warn('Server URI and Node ID are required', '');
    }
  }

  onDeleteConfirm(event): void {
    this.dialogService.open(ConfirmationComponent, { context: { type: 'device' } }).onClose.subscribe(
      confirm => {
        if (confirm) {
          event.confirm.resolve();

          this.opcuaService.deleteNode(event.data).subscribe(
            resp => {
            },
          );
        }
      },
    );
  }
}
