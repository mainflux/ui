import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Thing } from 'app/common/interfaces/mainflux.interface';


@Component({
  selector: 'ngx-devices-details-component',
  templateUrl: './devices.details.component.html',
  styleUrls: ['./devices.details.component.scss'],
})
export class DevicesDetailsComponent implements OnInit {
  offset = 0;
  limit = 20;

  thing: Thing = {};

  connections = [];
  channels = [];
  messages = [];

  selectedChannels = [];
  editorMetadata = '';

  constructor(
    private route: ActivatedRoute,
    private thingsService: ThingsService,
    private channelsService: ChannelsService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.thingsService.getThing(id).subscribe(
      resp => {
        this.thing = <Thing>resp;

        this.findDisconnectedChans();
      },
    );
  }

  onEdit() {
    try {
      this.thing.metadata = JSON.parse(this.editorMetadata);
    } catch (e) {
      this.notificationsService.error('Wrong metadata format', '');
      return;
    }

    this.thingsService.editThing(this.thing).subscribe(
      resp => {
        this.notificationsService.success('Device metadata successfully edited', '');
      },
    );
  }

  onConnect() {
    if (this.selectedChannels !== undefined) {
      this.selectedChannels.forEach(
        chan => {
          this.channelsService.connectThing(chan, this.thing.id).subscribe(
            resp => {
              this.notificationsService.success('Device successfully connected', '');
            },
          );
        },
      );
      this.findDisconnectedChans();
      this.selectedChannels = [];
    } else {
      this.notificationsService.warn('Channels must be provided', '');
    }
  }

  onDisconnect(chanID: any) {
    this.channelsService.disconnectThing(chanID, this.thing.id).subscribe(
      resp => {
        this.notificationsService.success('Thing successfully disconnected', '');
        this.findDisconnectedChans();
      },
    );
  }

  findDisconnectedChans() {
    this.channels = [];
    this.messages = [];

    this.thingsService.connectedChannels(this.thing.id).subscribe(
      (respConns: any) => {
        this.connections = respConns.channels;
        this.channelsService.getChannels(this.offset, this.limit).subscribe(
          (respChans: any) => {
            respChans.channels.forEach(chan => {
              if (!(this.connections.filter(c => c.id === chan.id).length > 0)) {
                this.channels.push(chan);
              } else {
                this.messagesService.getMessages(chan.id, this.thing.key).subscribe(
                  (respMsg: any) => {
                    if (respMsg.messages) {
                      this.messages = respMsg.messages;
                    }
                  },
                );
              }
            });
          },
        );
      },
    );
  }
}
