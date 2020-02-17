import { Injectable } from '@angular/core';

import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { DbReaderNode } from 'app/common/interfaces/dbreader.interface';

@Injectable()
export class DbReaderService {
  typeDbReader = 'dbReader';
  typeDbReaderServer = 'dbReader';

  constructor(
    private thingsService: ThingsService,
    private channelsService: ChannelsService,
    private notificationsService: NotificationsService,
  ) { }

  getNode(id: string) {
    return this.thingsService.getThing(id);
  }

  getNodes(offset: number, limit: number, name?: string) {
    return this.thingsService.getThings(offset, limit, this.typeDbReader, '', name);
  }

  addNode(node: any) {
    const nodeReq: DbReaderNode = {
      name: node.name,
      metadata: {
        type: this.typeDbReader,
        channel_id: '',
        db_reader_data: node.db_reader_data,
      },
    };

    // Check if a channel exist for serverURI
    return this.channelsService.getChannels(0, 1, 'dbReader', `{"serverURI": "${node.serverURI}"}`).map(
      (resp: any) => {
        if (resp.total === 0) {
          const chanReq = {
            name: `${this.typeDbReaderServer}-${node.name}`,
            metadata: {
              type: this.typeDbReader,
              db_reader_data: {
              },
            },
          };

          this.channelsService.addChannel(chanReq).subscribe(
            respChan => {
              const chanID = respChan.headers.get('location').replace('/channels/', '');
              nodeReq.metadata.channel_id = chanID;
              this.addAndConnect(nodeReq, chanID);
            },
          );
        } else {
          const chanID = resp.channels[0].id;
          nodeReq.metadata.channel_id = chanID;
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
            this.notificationsService.success('DB Reader successfully created', '');
          },
          err => {
            this.thingsService.deleteThing(thingID).subscribe();
          },
        );
      },
    );
  }

  editNode(node: any) {
    const nodeReq: DbReaderNode = {
      name: node.name,
      metadata: {
        type: this.typeDbReader,
        channel_id: node.channel_id,
        db_reader_data: node.db_reader_data,
      },
    };

    return this.thingsService.editThing(nodeReq).map(
      resp => {
        this.notificationsService.success('DB Reader successfully edited', '');
      },
    );
  }

  deleteNode(node: any) {
    const channelID = node.metadata.channel_id;
    return this.channelsService.deleteChannel(channelID).map(
      respChan => {
        this.thingsService.deleteThing(node.id).subscribe(
          respThing => {
            this.notificationsService.success('DB Reader successfully deleted', '');
          },
        );
      },
    );
  }

}
