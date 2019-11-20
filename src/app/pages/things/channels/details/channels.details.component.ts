import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Channel } from 'app/common/interfaces/models';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'ngx-channels-details-component',
  templateUrl: './channels.details.component.html',
  styleUrls: ['./channels.details.component.scss'],
})
export class ChannelsDetailsComponent implements OnInit {
  channel: Channel = {
    name: '',
    metadata: {},
  };

  connections: Array<{name: string, id: string}> = [];

  things = [];
  selectedThings = [];

  offset = 0;
  limit = 20;

  editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: true }) editor: JsonEditorComponent;
  constructor(
    private route: ActivatedRoute,
    private thingsService: ThingsService,
    private channelsService: ChannelsService,
    private notificationsService: NotificationsService,
  ) {
    this.editorOptions = new JsonEditorOptions();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.channelsService.getChannel(id).subscribe(
      resp => {
        this.channel = <Channel>resp;

        this.connections = [];

        this.channelsService.connectedThings(id).subscribe(
          (respConn: any) => {
            if (respConn.total) {
              respConn.things.forEach( chan => {
                this.connections.push(chan);
              });
            }
          },
        );

        this.thingsService.getThings(this.offset, this.limit).subscribe(
          (respThings: any) => {
            this.things = respThings.things;
          },
        );
      },
    );
  }

  onEdit() {
    this.channel.metadata = this.editor.get();
    this.channelsService.editChannel(this.channel).subscribe(
      resp => {
        this.notificationsService.success('Channel metadata successfully edited', '');
      },
    );
  }

  onConnect() {
    if (this.selectedThings !== undefined) {
      this.selectedThings.forEach(
        thing => {
          this.channelsService.connectThing(this.channel.id, thing).subscribe(
            resp => {
              this.notificationsService.success('Device successfully connected', '');
            },
          );
        },
      );
    } else {
      this.notificationsService.warn('Things must be provided', '');
    }
  }

  onDisconnect() {
    if (this.selectedThings !== undefined) {
      this.selectedThings.forEach(
        thing => {
          this.channelsService.disconnectThing(this.channel.id, thing).subscribe(
            resp => {
              this.notificationsService.success('Thing successfully disconnected', '');
            },
          );
        },
      );
    } else {
      this.notificationsService.warn('Things must be provided', '');
    }
  }
}
