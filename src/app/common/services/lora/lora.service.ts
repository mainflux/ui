import { Injectable } from '@angular/core';

import { LoraDevice, LoraTableRow } from 'app/common/interfaces/lora.interface';
import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

const defLimit: number = 20;

@Injectable()
export class LoraService {
  typeLora = 'lora';
  typeLoraApp = 'loraApp';

  constructor(
    private thingsService: ThingsService,
    private channelsService: ChannelsService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
  ) { }

  getDevice(id: string) {
    return this.thingsService.getThing(id);
  }

  getDevices(offset?: number, limit?: number, name?: string) {
    offset = offset || 0;
    limit = limit || defLimit;

    return this.thingsService.getThings(offset, limit, this.typeLora, '', name);
  }

  getChannels(offset: number, limit: number) {
    return this.channelsService.getChannels(offset, limit, this.typeLora);
  }

  addDevice(row: LoraTableRow) {
    // Check if a channel exist for row appID
    return this.channelsService.getChannels(0, 1, 'lora', `{"app_id": "${row.appID}"}`).map(
      (resp: any) => {
        if (resp.total === 0) {
          const chanReq = {
            name: `${this.typeLoraApp}-${row.appID}`,
            metadata: {
              type: this.typeLora,
              lora: {
                app_id: row.appID,
              },
            },
          };

          this.channelsService.addChannel(chanReq).subscribe(
            respChan => {
              const chanID = respChan.headers.get('location').replace('/channels/', '');
              this.addAndConnect(chanID, row);
            },
          );
        } else {
          const chanID = resp.channels[0].id;
          this.addAndConnect(chanID, row);
        }
      },
    );
  }

  addAndConnect(chanID: string, row: LoraTableRow) {
    const devReq: LoraDevice = {
      name: row.name,
      metadata: {
        type: this.typeLora,
        channel_id: chanID,
        lora: {
          dev_eui: row.devEUI,
          app_id: row.appID,
        },
      },
    };

    this.thingsService.addThing(devReq).subscribe(
      respThing => {
        const thingID = respThing.headers.get('location').replace('/things/', '');

        this.channelsService.connectThing(chanID, thingID).subscribe(
          respCon => {
            this.notificationsService.success('LoRa Device successfully created', '');

            // Send temperature and humidity messages
            this.messagesService.sendTempMock(chanID, thingID);
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
  }

  editDevice(row: LoraTableRow) {
    const devReq: LoraDevice = {
      id: row.id,
      name: row.name,
      metadata: row.metadata,
    };

    devReq.metadata.lora = {
        dev_eui: row.devEUI,
        app_id: row.appID,
    };

    return this.thingsService.editThing(row).map(
      resp => {
        this.notificationsService.success('LoRa Device successfully edited', '');
      },
    );
  }

  deleteDevice(loraDev: LoraTableRow) {
    const channelID = loraDev.metadata.channel_id;
    return this.channelsService.deleteChannel(channelID).map(
      () => {
        this.thingsService.deleteThing(loraDev.id).subscribe(
          resp => {
            this.notificationsService.success('LoRa Device successfully deleted', '');
          },
        );
      },
    );
  }
}
