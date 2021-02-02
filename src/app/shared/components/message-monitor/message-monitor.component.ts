import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Channel, Thing, MainfluxMsg, Message, MsgFilters, Dataset, TablePage } from 'app/common/interfaces/mainflux.interface';
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
  valType: string = 'float';
  valTypes: string[] = ['float', 'bool', 'string', 'data'];

  msgDatasets: Dataset[] = [];

  filters: MsgFilters = {
    offset: 0,
    limit: 20,
    publisher: '',
    subtopic: '',
    name: '',
    value: '',
    from: 0,
    to: 0,
  };

  publishers: Thing[] = [];

  messagesPage: TablePage = {};

  @Input() channels: Channel[] = [];
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
    if (this.channels === undefined) {
        return;
    }

    if (this.channels.length > 0 && this.channels[0].id && this.thingKey !== '') {
      this.chanID = this.channels[0].id;
      this.getChannelMessages();
    }
  }

  createChart() {
    const messages = this.messagesPage.rows.map((msg: Message) => {
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
    this.messagesPage.rows = [];

    this.messagesService.getMessages(this.chanID, this.thingKey, this.filters).subscribe(
      (resp: any) => {
        if (resp.messages) {
          this.messagesPage = {
            offset: resp.offset,
            limit: resp.limit,
            total: resp.total,
            rows: resp.messages,
          };
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

  onChangeLimit(lim: number) {
    this.filters.limit = lim;
    this.getChannelMessages();
  }

  onChangePage(dir: any) {
    if (dir === 'prev') {
      this.filters.offset = this.messagesPage.offset - this.messagesPage.limit;
    }
    if (dir === 'next') {
      this.filters.offset = this.messagesPage.offset + this.messagesPage.limit;
    }
    this.getChannelMessages();
  }

  ngOnDestroy(): void {
    this.intervalService.clear();
  }
}
