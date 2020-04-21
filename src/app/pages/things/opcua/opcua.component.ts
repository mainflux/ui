import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

import { LocalDataSource } from 'ng2-smart-table';

import { OpcuaService } from 'app/common/services/opcua/opcua.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { ConfirmationComponent } from 'app/shared/confirmation/confirmation.component';
import { DetailsComponent } from 'app/shared/details/details.component';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { OpcuaStore } from 'app/common/store/opcua.store';
import { FsService } from 'app/common/services/fs/fs.service';

const defSearchBardMs: number = 100;

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
      details: {
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
      name: {
        title: 'Name',
        addable: true,
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (cell.length > 20) {
            return `${cell.substring(0, 19)}...`;
          }
          return cell;
        },
      },
      serverURI: {
        title: 'Server URI',
        editable: false,
        addable: true,
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (cell.length > 30) {
            return `${cell.substring(10, 39)}...`;
          }
          return cell;
        },
      },
      nodeID: {
        title: 'Node ID',
        editable: true,
        addable: true,
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (cell.length > 20) {
            return `${cell.substring(0, 19)}...`;
          }
          return cell;
        },
      },
      messages: {
        title: 'Messages',
        editable: false,
        addable: false,
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (cell > 0) {
            return cell;
          }
          return '0';
        },
      },
      seen: {
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

  opcuaNodes = [];

  browseServerURI = '';
  // Standard root OPC-UA server NodeID (ns=0;i=84)
  browseNamespace = '';
  browseIdentifier = '';

  browsedNodes = [];
  browseSearch = [];
  checkedNodes = [];

  offset = 0;
  limit = 20;

  searchTime = 0;
  columnChar = '|';

  constructor(
    private opcuaService: OpcuaService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
    private opcuaStore: OpcuaStore,
    private dialogService: NbDialogService,
    private fsService: FsService,
  ) { }

  ngOnInit() {
    const browseStore = this.opcuaStore.getBrowsedNodes();
    this.browseServerURI = browseStore.uri;
    this.browsedNodes = browseStore.nodes;
    this.getOpcuaNodes();
  }

  getOpcuaNodes(name?: string): void {
    this.opcuaService.getNodes(this.offset, this.limit, name).subscribe(
      (resp: any) => {
        this.opcuaNodes = [];

        resp.things.forEach(node => {
          node.serverURI = node.metadata.opcua.server_uri;
          node.nodeID = node.metadata.opcua.node_id;

          const chanID: string = node.metadata ? node.metadata.channel_id : '';
          this.messagesService.getMessages(chanID, node.key, node.id).subscribe(
            (msgResp: any) => {
              if (msgResp.messages) {
                node.seen = msgResp.messages[0].time;
                node.messages = msgResp.total;
              }

              this.opcuaNodes.push(node);
              this.source.load(this.opcuaNodes);
              this.source.refresh();
            },
            err => {
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
    // Check if subscription already exist
    if (this.isSubscribed(event.newData.serverURI, event.newData.nodeID)) {
      return;
    }

    // Check ServerURI and NodeID
    if (event.newData.serverURI !== '' && event.newData.nodeID !== '') {
      // close create row
      event.confirm.resolve();

      this.opcuaService.addNodes(event.newData.serverURI, [event.newData]).subscribe(
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
              setTimeout(
                () => {
                  this.getOpcuaNodes();
                }, 3000,
              );
            },
          );
        }
      },
    );
  }

  browseOpcuaNodes() {
    this.opcuaService.browseServerNodes(this.browseServerURI, this.browseNamespace, this.browseIdentifier).subscribe(
      (resp: any) => {
        this.browsedNodes = resp.nodes;
        const browsedNodes = {
          uri: this.browseServerURI,
          nodes: this.browsedNodes,
        };
        this.opcuaStore.setBrowsedNodes(browsedNodes);
      },
      err => {
      },
    );
  }

  onCheckboxChanged(event: boolean, node: any) {
    if (event === true) {
      this.checkedNodes.push(node.NodeID);
    } else {
      this.checkedNodes = this.checkedNodes.filter(n => n !== node.NodeID);
    }
  }

  subscribeOpcuaNodes() {
    const nodesReq = [];
    this.checkedNodes.forEach( (checkedNode, i) => {
      const nodeReq = {
        name: checkedNode,
        serverURI: this.browseServerURI,
        nodeID: checkedNode,
      };

      // Check if subscription already exist
      if (!this.isSubscribed(this.browseServerURI, checkedNode)) {
        nodesReq.push(nodeReq);
      }
    });

    this.opcuaService.addNodes(this.browseServerURI,  nodesReq).subscribe(
      resp => {
        setTimeout(
          () => {
            this.getOpcuaNodes();
          }, 3000,
        );
      },
    );
  }

  isSubscribed(serverURI: string, nodeID: string) {
    const subs = this.opcuaNodes.filter(n => n.serverURI === serverURI && n.nodeID === nodeID);
    if (subs.length !== 0) {
      this.notificationsService.warn(`Subscribtion to server ${serverURI} and nodeID ${nodeID} already exist`, '');
      return true;
    }

    return false;
  }

  searchNode(input) {
    const t = new Date().getTime();
    if ((t - this.searchTime) > defSearchBardMs) {
      this.getOpcuaNodes(input);
      this.searchTime = t;
    }
  }

  searchBrowse(input) {
    const browseStore = this.opcuaStore.getBrowsedNodes();
    this.browsedNodes = browseStore.nodes.filter( node =>
      (node.NodeID.includes(input) ||
      node.Description.includes(input) ||
      node.DataType.includes(input) ||
      node.BrowseName.includes(input)));
  }

  onClickSave() {
    this.fsService.exportToCsv('opcua_nodes.csv', this.opcuaNodes);
  }

  onFileSelected(files: FileList) {
    if (files && files.length > 0) {
      const file: File = files.item(0);
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const csv: string = reader.result as string;
        const lines = csv.split('\n');

        // Split all file lines using a separator
        lines.forEach( (line, i) => {
          const cols = line.split(this.columnChar);
          const name = cols[0];
          const nodes = [];
          if (name !== '' && name !== '<empty string>' && cols.length > 2) {
            const serv = cols[1];
            for (let j = 2; j < cols.length; j++) {
              const node = {
                name: cols[0],
                serverURI: serv,
                nodeID: cols[j],
              };
              nodes.push(node);
            }

            this.opcuaService.addNodes(serv, nodes).subscribe(
              resp => {
                setTimeout( () => {
                  this.getOpcuaNodes();
                }, 3000 * i);
              },
            );
          } else {
            this.notificationsService.warn('Incomplete line found in file', '');
          }
        });
      };
    }
  }
}
