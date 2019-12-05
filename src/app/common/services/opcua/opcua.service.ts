import { Injectable } from '@angular/core';

import { OpcuaNode } from 'app/common/interfaces/opcua.interface';
import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

@Injectable()
export class OpcuaService {
  typeOpcua = 'opcua';
  typeOpcuaServer = 'OPC-UA-Server';

  constructor(
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
    const chanReq = {
      name: `${this.typeOpcuaServer}-${node.name}`,
      metadata: {
        type: this.typeOpcua,
        opcua: {
          serverURI: node.serverURI,
        },
      },
    };

    // TODO - Check if channel exist
    return this.channelsService.addChannel(chanReq).map(
      respChan => {
        const chanID = respChan.headers.get('location').replace('/channels/', '');
        const nodeReq: OpcuaNode = {
          name: node.name,
          metadata: {
            type: this.typeOpcua,
            channelID: chanID,
            opcua: {
              nodeID: node.nodeID,
              serverURI: node.serverURI,
            },
          },
        };

        this.thingsService.addThing(nodeReq).subscribe(
          respThing => {
            const thingID = respThing.headers.get('location').replace('/things/', '');
            this.channelsService.connectThing(chanID, thingID).subscribe(
              respCon => {
                this.notificationsService.success('OPC-UA Node successfully created', '');
              },
              err => {
                this.thingsService.deleteThing(thingID).subscribe();
                this.channelsService.deleteChannel(chanID).subscribe();
              },
            );
          },
          err => {
            this.channelsService.deleteChannel(chanID).subscribe();
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
}
