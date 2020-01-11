import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { OpcuaNode } from 'app/common/interfaces/opcua.interface';
import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

@Injectable()
export class OpcuaService {
  typeOpcua = 'opcua';
  typeOpcuaServer = 'OPC-UA-Server';

  constructor(
    private http: HttpClient,
    private thingsService: ThingsService,
    private channelsService: ChannelsService,
    private notificationsService: NotificationsService,
  ) { }

  getNode(id: string) {
    return this.thingsService.getThing(id);
  }

  getNodes(offset: number, limit: number) {
    return this.thingsService.getThings(offset, limit, this.typeOpcua);
  }

  addNode(node: any) {
    const nodeReq: OpcuaNode = {
      name: node.name,
      metadata: {
        type: this.typeOpcua,
        channelID: '',
        opcua: {
          nodeID: node.nodeID,
          serverURI: node.serverURI,
        },
      },
    };

    // Check if a channel exist for serverURI
    return this.channelsService.getChannels(0, 1, 'opcua', `{"serverURI": "${node.serverURI}"}`).map(
      (resp: any) => {
        if (resp.total === 0) {
          const chanReq = {
            name: `${this.typeOpcuaServer}-${node.name}`,
            metadata: {
              type: this.typeOpcua,
              opcua: {
                serverURI: node.serverURI,
              },
            },
          };

          this.channelsService.addChannel(chanReq).subscribe(
            respChan => {
              const chanID = respChan.headers.get('location').replace('/channels/', '');
              nodeReq.metadata.channelID = chanID;
              this.addAndConnect(nodeReq, chanID);
            },
          );
        } else {
          const chanID = resp.channels[0].id;
          nodeReq.metadata.channelID = chanID;
          this.addAndConnect(nodeReq, chanID);
        }
      },
    );
  }

  addAndConnect(nodeReq: any, chanID: string) {
    this.thingsService.addThing(nodeReq).subscribe(
      respThing => {
        const thingID = respThing.headers.get('location').replace('/things/', '');
        this.channelsService.connectThing(chanID, thingID).subscribe(
          respCon => {
            this.notificationsService.success('OPC-UA Node successfully created', '');
          },
          err => {
            this.thingsService.deleteThing(thingID).subscribe();
          },
        );
      },
    );
  }

  editNode(node: any) {
    const nodeReq: OpcuaNode = {
      id: node.id,
      name: node.name,
      metadata: {
        type: this.typeOpcua,
        opcua: {
          serverURI: node.serverURI,
          nodeID: node.nodeID,
        },
      },
    };

    return this.thingsService.editThing(nodeReq).map(
      resp => {
        this.notificationsService.success('OPC-UA Node successfully edited', '');
      },
    );
  }

  deleteNode(node: any) {
    const channelID = node.metadata.channelID;
    return this.channelsService.deleteChannel(channelID).map(
      respChan => {
        this.thingsService.deleteThing(node.id).subscribe(
          respThing => {
            this.notificationsService.success('OPC-UA Node successfully deleted', '');
          },
        );
      },
    );
  }

  browseServerNodes(uri: string, ns: string, id: string) {
    const params = new HttpParams()
      .set('server', uri)
      .set('namespace', ns)
      .set('identifier', id);

    return this.http.get(environment.browseUrl, { params })
      .map(
        resp => {
          this.notificationsService.success('OPC-UA browsing finished', '');
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to Browse',
            `Error: ${err.status} - ${err.statusText}`);
          return Observable.throw(err);
        },
      );
  }
}
