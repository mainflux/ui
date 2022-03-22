import { Component, ViewChild, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

import { ChannelsService } from 'app/common/services/channels/channels.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Thing, Channel, CardConf } from 'app/common/interfaces/mainflux.interface';

@Component({
  selector: 'ngx-message-monitor-config-component',
  templateUrl: './message-monitor.config.component.html',
  styleUrls: ['./message-monitor.config.component.scss'],
})
export class MessageMonitorConfigComponent implements OnInit {
  value: any;
  valueType: string = 'float';
  valueTypes: string[] = ['float', 'bool', 'string', 'data'];
  format: string = 'senml';
  formats: string[] = ['senml', 'json'];
  modes: string[] = ['json', 'table', 'chart'];

  channels: Channel[] = [];
  publishers: Thing[] = [];

  config: CardConf = {
      title: '',
      channel: '',
      filters: {
        publisher: '',
        subtopic: '',
        format: '',
        name: '',
        from: 0,
        to: 0,
      },
  };
  constructor(
    private channelsService: ChannelsService,
    protected dialogRef: NbDialogRef<MessageMonitorConfigComponent>,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit() {
    this.getChannels();
  }

  cancel() {
    this.dialogRef.close(false);
  }

  submit() {
    switch (this.valueType) {
      case 'string':
        this.config.filters.vs = this.value;
        break;
      case 'data':
        this.config.filters.vd = this.value;
        break;
      case 'bool':
        this.config.filters.vb = this.value;
        break;
      case 'float':
        this.config.filters.v = this.value;
        break;
    }

    switch (this.format) {
      case 'senml':
        this.config.filters.format = 'messages';
        break;
      case 'json':
        this.config.filters.format = this.format;
        break;
    }

    this.dialogRef.close(this.config);
  }

  getChannels() {
    const filters = {
      offset: 0,
      limit: 20,
    };
    this.channelsService.getChannels(filters).subscribe(
      (resp: any) => {
        this.channels = resp.channels;
        this.getConnectedThings();
      },
    );
  }

  getConnectedThings() {
    if (this.config.channel) {
      this.channelsService.connectedThings(this.config.channel).subscribe(
        (resp: any) => {
          if (resp.things) {
            this.publishers = resp.things;
          }
        },
      );
    }
  }

  getRangeDate(event) {
    if (event.start && event.end) {
      this.config.filters.from = new Date(event.start).getTime() / 1000;
      this.config.filters.to = new Date(event.end).getTime() / 1000;
    }
  }

  onSelectChannel() {
    this.getConnectedThings();
  }
}
