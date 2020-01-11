import { Injectable } from '@angular/core';

import { LoraDevice } from 'app/common/interfaces/lora.interface';
import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

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

  getDevices(offset: number, limit: number) {
    return this.thingsService.getThings(offset, limit, this.typeLora);
  }

  getChannels(offset: number, limit: number) {
    return this.channelsService.getChannels(offset, limit, this.typeLora);
  }

  addDevice(row: LoraDevice) {
    const chanReq = {
      name: `${this.typeLoraApp}-${row.appID}`,
      metadata: {
        type: this.typeLora,
        lora: {
          appID: row.appID,
        },
      },
    };

    // TODO - Check if channel exist
    return this.channelsService.addChannel(chanReq).map(
      respChan => {
        const chanID = respChan.headers.get('location').replace('/channels/', '');
        const devReq: LoraDevice = {
          name: row.name,
          metadata: {
            type: this.typeLora,
            channelID: chanID,
            lora: {
              devEUI: row.devEUI,
              appID: row.appID,
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
      },
    );
  }

  editDevice(row: LoraDevice) {
    row.name = row.name,
    row.metadata.lora = {
        devEUI: row.devEUI,
        appID: row.appID,
    };

    return this.thingsService.editThing(row).map(
      resp => {
        this.notificationsService.success('LoRa Device successfully edited', '');
      },
    );
  }

  deleteDevice(loraDev: LoraDevice) {
    const channelID = loraDev.metadata.channelID;
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
