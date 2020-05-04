import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid';

import { Gateway } from 'app/common/interfaces/gateway.interface';
import { Thing, Channel } from 'app/common/interfaces/mainflux.interface';
import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { BootstrapService } from 'app/common/services/bootstrap/bootstrap.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { MqttService } from 'ngx-mqtt';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

const defLimit: number = 20;

@Injectable()
export class GatewaysService {
  typeGateway = 'gateway';
  typeCtrlChan = 'control-channel';
  typeDataChan = 'data-channel';
  typeExportChan = 'export-channel';

  constructor(
    private thingsService: ThingsService,
    private channelsService: ChannelsService,
    private bootstrapService: BootstrapService,
    private messagesService: MessagesService,
    private mqttService: MqttService,
    private notificationsService: NotificationsService,
  ) { }

  getGateways(offset?: number, limit?: number, name?: string) {
    offset = offset || 0;
    limit = limit || defLimit;

    return this.thingsService.getThings(offset, limit, this.typeGateway, '', name);
  }

  getCtrlChannels(offset: number, limit: number) {
    return this.channelsService.getChannels(offset, limit, this.typeCtrlChan);
  }

  getDataChannels(offset: number, limit: number) {
    return this.channelsService.getChannels(offset, limit, this.typeDataChan);
  }

  addGateway(name: string, mac: string) {
    const gateway: Gateway = {
      name: name,
      metadata: {
        type: this.typeGateway,
        mac: mac,
      },
    };

    return this.thingsService.addThing(gateway).map(
      resp => {
        const gwID = resp.headers.get('location').replace('/things/', '');
        this.thingsService.getThing(gwID).subscribe(
          (respGetThing: Thing) => {
            gateway.key = respGetThing.key;
            const ctrlChan: Channel = {
              name: `${gateway.name}-${this.typeCtrlChan}`,
              metadata: {
                type: this.typeCtrlChan,
              },
            };
            this.channelsService.addChannel(ctrlChan).subscribe(
              respAddCtrl => {
                const ctrlChanID = respAddCtrl.headers.get('location').replace('/channels/', '');

                const dataChannel: Channel = {
                  name: `${gateway.name}-${this.typeDataChan}`,
                  metadata: {
                    type: this.typeDataChan,
                  },
                };
                this.channelsService.addChannel(dataChannel).subscribe(
                  respAddData => {
                    const dataChanID = respAddData.headers.get('location').replace('/channels/', '');

                    const exportChannel: Channel = {
                      name: `${gateway.name}-${this.typeExportChan}`,
                      metadata: {
                        type: this.typeExportChan,
                      },
                    };
                    this.channelsService.addChannel(exportChannel).subscribe(
                      respAddExport => {
                        const exportChanID = respAddExport.headers.get('location').replace('/channels/', '');

                        this.channelsService.connectThing(ctrlChanID, gwID).subscribe(
                          respConnectCtrl => {
                            this.channelsService.connectThing(dataChanID, gwID).subscribe(
                              respConnectData => {
                                this.channelsService.connectThing(exportChanID, gwID).subscribe(
                                  respConnectExport => {
                                    gateway.metadata.ctrl_channel_id = ctrlChanID;
                                    gateway.metadata.data_channel_id = dataChanID;
                                    gateway.metadata.export_channel_id = exportChanID;
                                    gateway.metadata.gw_password = uuid();
                                    gateway.id = gwID;

                                    this.thingsService.editThing(gateway).subscribe(
                                      () => {
                                        this.notificationsService.success('Gateway successfully created', '');

                                        // Send fake location
                                        this.messagesService.sendLocationMock(dataChanID, gwID);

                                        // Bootstrap gateway
                                        this.bootstrapService.addConfig(gateway).subscribe();
                                      },
                                      errEdit => {
                                        this.deleteGateway(gateway).subscribe();
                                      },
                                    );
                                  },
                                  errExportConnect => {
                                    this.deleteGateway(gateway).subscribe();
                                  },
                                );
                              },
                              errDataConnect => {
                                this.deleteGateway(gateway).subscribe();
                              },
                            );
                          },
                          errCtrlConnect => {
                            this.deleteGateway(gateway).subscribe();
                          },
                        );
                      },
                      errAddExport => {
                        this.deleteGateway(gateway).subscribe();
                      },
                    );
                  },
                  errAddData => {
                    this.deleteGateway(gateway).subscribe();
                  },
                );
              },
            );
          },
        );
      },
    );
  }

  editGateway(name: string, mac: string, gateway: Gateway) {
    gateway.metadata.mac = mac;

    return this.thingsService.editThing(gateway).map(
      resp => {
        this.notificationsService.success('Gateway successfully edited', '');
        return resp;
      },
    );
  }

  deleteGateway(gw: Gateway) {
    return this.thingsService.deleteThing(gw.id).map(
      resp => {
        this.notificationsService.success('Gateway successfully deleted', '');

        this.channelsService.deleteChannel(gw.metadata.ctrl_channel_id).subscribe();
        this.channelsService.deleteChannel(gw.metadata.data_channel_id).subscribe();
        this.channelsService.deleteChannel(gw.metadata.export_channel_id).subscribe();
      },
    );
  }

  getGateway(gatewayID: string) {
    return this.thingsService.getThing(gatewayID);
  }

  sendLocationMqtt(gwID: string) {
    this.thingsService.getThing(gwID).subscribe(
      (resp: any) => {
        const gw: Gateway = resp;
        // TODO: remove this mocks
        const topic = 'channels/' + gw.metadata.data_channel_id + '/messages';
        const lon = 48 + 2 * Math.random();
        const lat = 20 + 2 * Math.random();
        const cmd = `[{"bn":"location-", "n":"lon", "v":${lon}}, {"n":"lat", "v":${lat}}]`;
        this.mqttService.connect({
          username: gw.id,
          password: gw.key,
        });
        this.mqttService.publish(topic + '/req', cmd).subscribe();
      },
    );
  }
}
