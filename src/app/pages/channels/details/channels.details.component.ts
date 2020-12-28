import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'environments/environment';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Channel, Thing, MainfluxMsg, MsgFilters, DateFilter } from 'app/common/interfaces/mainflux.interface';
import { IntervalService } from 'app/common/services/interval/interval.service';

@Component({
  selector: 'ngx-channels-details-component',
  templateUrl: './channels.details.component.html',
  styleUrls: ['./channels.details.component.scss'],
  providers: [IntervalService],
})
export class ChannelsDetailsComponent implements OnInit, OnDestroy {
  experimental: Boolean = environment.experimental;

  channel: Channel = {};

  connectedThings: Thing[] = [];
  disconnectedThings: Thing[] = [];
  messages: MainfluxMsg[] = [];

  selectedThings: string[] = [];
  editorMetadata = '';

  filters: MsgFilters = {
    offset: 0,
    limit: 20,
    publisher: '',
    subtopic: '',
    from: 0,
    to: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private intervalService: IntervalService,
    private channelsService: ChannelsService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit() {
    const chanID = this.route.snapshot.paramMap.get('id');

    this.channelsService.getChannel(chanID).subscribe(
      (ch: Channel) => {
        this.channel = ch;
        this.updateConnections();
      },
    );

    this.intervalService.set(this, this.getChannelMessages);
  }

  onEdit() {
    if (this.editorMetadata !== '') {
      try {
        this.channel.metadata = JSON.parse(this.editorMetadata);
      } catch (e) {
        this.notificationsService.error('Wrong metadata format', '');
        return;
      }
    }

    this.channelsService.editChannel(this.channel).subscribe(
      resp => {
        this.notificationsService.success('Channel metadata successfully edited', '');
      },
    );
  }

  onConnect() {
    if (this.selectedThings.length > 0) {
      this.channelsService.connectThings([this.channel.id], this.selectedThings).subscribe(
        resp => {
          this.updateConnections();
          this.notificationsService.success('Thing(s) successfully connected', '');
        },
      );
    } else {
      this.notificationsService.warn('Thing(s) must be provided', '');
    }
  }

  onDisconnect(thingID: any) {
    this.channelsService.disconnectThing(this.channel.id, thingID).subscribe(
      resp => {
        this.updateConnections();
        this.notificationsService.success('Thing successfully disconnected', '');
      },
    );
  }

  updateConnections() {
    this.selectedThings = [];
    this.findConnectedThings();
    this.findDisconnectedThings();
  }

  findConnectedThings() {
    this.channelsService.connectedThings(this.channel.id).subscribe(
      (resp: any) => {
        this.connectedThings = resp.things;
        this.getChannelMessages();
      },
    );
  }

  findDisconnectedThings() {
    this.channelsService.disconnectedThings(this.channel.id).subscribe(
      (respDisconns: any) => {
        this.disconnectedThings = respDisconns.things;
      },
    );
  }

  getChannelMessages() {
    if (this.connectedThings.length) {
      this.messagesService.getMessages(this.channel.id, this.connectedThings[0].key, this.filters).subscribe(
        (respMsg: any) => {
          if (respMsg.messages) {
            this.messages = respMsg.messages;
          }
        },
      );
    }
  }

  onChangeDate(event: DateFilter) {
    console.log(event);

    this.filters.from = event.from;
    this.filters.to = event.to;
    this.getChannelMessages();
  }

  ngOnDestroy(): void {
    this.intervalService.clear();
  }
}
