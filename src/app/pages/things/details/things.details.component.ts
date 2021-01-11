import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'environments/environment';
import { ThingsService } from 'app/common/services/things/things.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Channel, Thing, MainfluxMsg, MsgFilters, DateFilter } from 'app/common/interfaces/mainflux.interface';
import { IntervalService } from 'app/common/services/interval/interval.service';

@Component({
  selector: 'ngx-things-details-component',
  templateUrl: './things.details.component.html',
  styleUrls: ['./things.details.component.scss'],
  providers: [IntervalService],
})
export class ThingsDetailsComponent implements OnInit, OnDestroy {
  experimental: Boolean = environment.experimental;

  thing: Thing = {};

  connectedChans: Channel[] = [];
  disconnectedChans: Channel[] = [];
  messages: MainfluxMsg[] = [];

  selectedChannels = [];
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
    private thingsService: ThingsService,
    private channelsService: ChannelsService,
    private messagesService: MessagesService,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.thingsService.getThing(id).subscribe(
      (th: Thing) => {
        this.thing = th;
        this.filters.publisher = this.thing.id;
        this.updateConnections();
      },
    );

    this.intervalService.set(this, this.getChannelMessages);
  }

  onEdit() {
    if (this.editorMetadata !== '') {
      try {
        this.thing.metadata = JSON.parse(this.editorMetadata);
      } catch (e) {
        this.notificationsService.error('Wrong metadata format', '');
        return;
      }
    }

    this.thingsService.editThing(this.thing).subscribe(
      resp => {
        this.notificationsService.success('Thing metadata successfully edited', '');
      },
    );
  }

  onConnect() {
    if (this.selectedChannels.length > 0) {
      this.channelsService.connectThings(this.selectedChannels, [this.thing.id]).subscribe(
        resp => {
          this.notificationsService.success('Successfully connected to Channel(s)', '');
          this.updateConnections();
        },
      );
    } else {
      this.notificationsService.warn('Channel(s) must be provided', '');
    }
  }

  onDisconnect(chanID: any) {
    this.channelsService.disconnectThing(chanID, this.thing.id).subscribe(
      resp => {
        this.notificationsService.success('Successfully disconnected from Channel', '');
        this.updateConnections();
      },
    );
  }

  updateConnections() {
    this.selectedChannels = [];
    this.findConnectedChans();
    this.findDisconnectedChans();
  }

  findConnectedChans() {
    this.thingsService.connectedChannels(this.thing.id).subscribe(
      (respConns: any) => {
        this.connectedChans = respConns.channels;
        this.getChannelMessages();
      },
    );
  }

  findDisconnectedChans() {
    this.thingsService.disconnectedChannels(this.thing.id).subscribe(
      (respDisconn: any) => {
        this.disconnectedChans = respDisconn.channels;
      },
    );
  }

  getChannelMessages() {
    const messages: MainfluxMsg[] = [];
    this.connectedChans.forEach((chan, i) => {
      this.messagesService.getMessages(chan.id, this.thing.key, this.filters).subscribe(
        (respMsg: any) => {
          if (respMsg.messages) {
            respMsg.messages.forEach((msg: MainfluxMsg) => messages.push(msg));
            if (i === this.connectedChans.length - 1) {
              this.messages = messages;
            }
          }
        },
      );
    });
  }

  onChangeDate(event: DateFilter) {
    this.filters.from = event.from;
    this.filters.to = event.to;
    this.getChannelMessages();
  }

  ngOnDestroy(): void {
    this.intervalService.clear();
  }
}
