import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Channel, Thing, MainfluxMsg, Message, MsgFilters, Dataset } from 'app/common/interfaces/mainflux.interface';
import { IntervalService } from 'app/common/services/interval/interval.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';

@Component({
  selector: 'ngx-message-monitor',
  templateUrl: './message-monitor.component.html',
  styleUrls: ['./message-monitor.component.scss'],
})
export class MessageMonitorComponent implements OnInit, OnChanges, OnDestroy {
  messages: MainfluxMsg[] = [];
  chanID = '';

  mode: string = 'table';
  modes: string[] = ['json', 'table', 'chart'];
  msgDatasets: Dataset[] = [];

  filters: MsgFilters = {
    offset: 0,
    limit: 20,
    publisher: '',
    subtopic: '',
    name: '',
    from: 0,
    to: 0,
  };

  publishers: Thing[] = [];

  @Input() channels: Channel[];
  @Input() thingKey: string;
  constructor(
    private intervalService: IntervalService,
    private messagesService: MessagesService,
    private channelsService: ChannelsService,
  ) {}

  ngOnInit() {
    this.intervalService.set(this, this.getChannelMessages);
  }

  getRangeDate(event) {
    if (event.start && event.end) {
      this.filters = {
        from: new Date(event.start).getTime() / 1000,
        to: new Date(event.end).getTime() / 1000,
      };
    }

    this.getChannelMessages();
  }

  ngOnChanges() {
    if (this.channels.length > 0 && this.channels[0].id && this.thingKey !== '') {
      this.chanID = this.channels[0].id;
      this.getChannelMessages();
    }
  }

  createChart() {
    const messages = this.messages.map(msg => {
      const m: Message = {time: msg.time, value: msg.value};
      return m;
    });

    const ds: Dataset = {
      label: `Channel: ${this.chanID}`,
      messages: messages,
    };

    this.msgDatasets = [ds];
  }

  getChannelMessages() {
    this.messages = [];

    this.messagesService.getMessages(this.chanID, this.thingKey, this.filters).subscribe(
      (resp: any) => {
        if (resp.messages) {
          this.messages = resp.messages;
          this.createChart();
        }
      },
    );

    this.channelsService.connectedThings(this.chanID).subscribe(
      (resp: any) => {
        if (resp.things) {
          this.publishers = resp.things;
        }
      },
    );
  }

  ngOnDestroy(): void {
    this.intervalService.clear();
  }
}
