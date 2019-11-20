import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Thing } from 'app/common/interfaces/models';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'ngx-devices-details-component',
  templateUrl: './devices.details.component.html',
  styleUrls: ['./devices.details.component.scss'],
})
export class DevicesDetailsComponent implements OnInit {
  offset = 0;
  limit = 20;

  thing: Thing = {};

  connections: Array<{name: string, id: string}> = [];

  channels = [];
  messages = [];
  selectedChannels = [];

  editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;
  constructor(
    private route: ActivatedRoute,
    private thingsService: ThingsService,
    private channelsService: ChannelsService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
  ) {
    this.editorOptions = new JsonEditorOptions();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.thingsService.getThing(id).subscribe(
      resp => {
        this.thing = <Thing>resp;

        this.connections = [];

        this.thingsService.connectedChannels(id).subscribe(
          (respCons: any) => {
            this.connections = respCons.channels;

            this.connections.forEach(
              channel => {
                this.messagesService.getMessages(channel.id, this.thing.key).subscribe(
                  (respMsg: any) => {
                    if (respMsg.messages) {
                      this.messages = respMsg.messages;
                    }
                  },
                );
              },
            );
          },
        );

        this.channelsService.getChannels(this.offset, this.limit).subscribe(
          (respChans: any) => {
            this.channels = respChans.channels;
          },
        );
      },
    );
  }

  onEdit() {
    this.thing.metadata = this.editor.get();
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
    } else {
      this.notificationsService.warn('Channels must be provided', '');
    }
  }

  onDisconnect() {
    if (this.selectedChannels !== undefined) {
      this.selectedChannels.forEach(
        chan => {
          this.channelsService.disconnectThing(chan, this.thing.id).subscribe(
            resp => {
              this.notificationsService.success('Thing successfully disconnected', '');
            },
          );
        },
      );
    } else {
      this.notificationsService.warn('Channels must be provided', '');
    }
  }
}
