import { Component, Input, Output, OnInit, OnChanges, OnDestroy, EventEmitter } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

import { Channel, Thing, MainfluxMsg, CardConf, Dataset,
  TableConfig, TablePage, ReaderUrl } from 'app/common/interfaces/mainflux.interface';
import { IntervalService } from 'app/common/services/interval/interval.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { ChannelsService } from 'app/common/services/channels/channels.service';
import { environment } from 'environments/environment';
import { MessageValuePipe } from 'app/shared/pipes/message-value.pipe';
import { MessageMonitorConfigComponent } from './config/message-monitor.config.component';

@Component({
  selector: 'ngx-message-monitor',
  templateUrl: './message-monitor.component.html',
  styleUrls: ['./message-monitor.component.scss'],
})
export class MessageMonitorComponent implements OnInit, OnChanges, OnDestroy {
  messages: MainfluxMsg[] = [];

  msgDatasets: Dataset[] = [];

  readerUrl: ReaderUrl = {
    prefix: environment.readerPrefix,
    suffix: environment.readerSuffix,
  };

  publishers: Thing[] = [];

  tableConfig: TableConfig = {
    colNames: ['Name', 'Value', 'Time', 'Subtopic', 'Channel', 'Publisher', 'Protocol'],
    keys: ['name', 'value', 'time', 'subtopic', 'channel', 'publisher', 'protocol'],
  };
  messagesPage: TablePage = {};

  @Input() config: CardConf = {
    mode: '',
    channel: '',
    filters: {
      offset: 0,
      limit: 20,
      publisher: '',
      subtopic: '',
      format: '',
      name: '',
      from: 0,
      to: 0,
    },
  };
  @Output() saveConfigEvent: EventEmitter<any> = new EventEmitter();
  @Output() deleteConfigEvent: EventEmitter<any> = new EventEmitter();
  constructor(
    private intervalService: IntervalService,
    private messagesService: MessagesService,
    private channelsService: ChannelsService,
    private messageValuePipe: MessageValuePipe,
    private dialogService: NbDialogService,
  ) {}

  ngOnInit() {
    if (this.config.channel !== undefined) {
      this.intervalService.set(this, this.getChannelMessages);
    }
  }

  ngOnChanges() {
    if (this.config.channel !== undefined) {
      this.getChannelMessages();
    }
  }

  getChannelMessages() {
    this.messagesPage.rows = [];
    this.messagesService.getMessages(this.config.channel, this.config.filters || {}, this.readerUrl).subscribe(
      (resp: any) => {
        if (resp.messages) {
          this.messagesPage = {
            offset: resp.offset,
            limit: resp.limit,
            total: resp.total,
            rows: resp.messages.map((msg: MainfluxMsg) => {
              if (msg.value !== undefined) {
                msg.value = this.messageValuePipe.transform(msg);
              }
              if (msg.string_value !== undefined) {
                msg.value = this.messageValuePipe.transform(msg);
                delete msg.string_value;
              }
              if (msg.bool_value !== undefined) {
                msg.value = this.messageValuePipe.transform(msg);
                delete msg.bool_value;
              }
              if (msg.data_value !== undefined) {
                msg.value = this.messageValuePipe.transform(msg);
                delete msg.data_value;
              }
              return msg;
            }),
          };
          this.msgDatasets = [{
            label: `Channel: ${this.config.channel}`,
            messages: <MainfluxMsg[]>this.messagesPage.rows,
          }];
        }
      },
    );
  }

  onChangeLimit(lim: number) {
    this.config.filters.offset = 0;
    this.config.filters.limit = lim;
    this.getChannelMessages();
  }

  onChangePage(offset: any) {
    this.config.filters.offset = offset;
    this.getChannelMessages();
  }

  ngOnDestroy(): void {
    this.intervalService.clear();
  }

  openConfigModal() {
    this.config.filters = this.config.filters || {};
    this.dialogService.open(MessageMonitorConfigComponent, { context: {config: this.config} }).onClose.subscribe(
      resp => {
        if (resp === false) {
          this.deleteConfigEvent.emit();
        }
        if (resp) {
          this.config = resp;
          this.saveConfigEvent.emit(resp);
          this.getChannelMessages();
        }
      },
    );
  }
}
