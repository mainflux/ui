import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ChannelsService } from 'app/common/services/channels/channels.service';
import { TwinsService } from 'app/common/services/twins/twins.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { Thing, Channel, Attribute, Definition, Twin, MainfluxMsg } from 'app/common/interfaces/mainflux.interface';

const stateInterval: number = 5 * 1000;

@Component({
  selector: 'ngx-twins-details-component',
  templateUrl: './twins.details.component.html',
  styleUrls: ['./twins.details.component.scss'],
})
export class TwinsDetailsComponent implements OnInit, OnDestroy {
  offset = 0;
  limit = 100;

  twin: Twin = {};
  def: Definition;
  defChans: {};
  defAttrs: Attribute[] = [];
  defDelta: number = 1e6;
  twinName: string;

  channels: Channel[] = [];

  editAttrs: Attribute[] = [];
  editAttr: Attribute = {
    name: '',
    channel: '',
    subtopic: '',
    persist_state: false,
  };

  state = {};
  stateIntervalID: number;
  stateTime: Date;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private channelsService: ChannelsService,
    private twinsService: TwinsService,
    private notificationsService: NotificationsService,
    private messagesService: MessagesService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.getTwin(id);
    this.getChannels();
    if (!this.stateIntervalID) {
      this.stateIntervalID = window.setInterval(this.getState.bind(this), stateInterval);
    }
  }

  getTwin(id: string) {
    this.state = {};
    this.defChans = {};
    this.twinsService.getTwin(id).subscribe(
      resp => {
        this.twin = <Twin>resp;

        this.def = this.twin.definitions[this.twin.definitions.length - 1];
        this.defDelta = this.def.delta;
        this.defAttrs = this.def.attributes;
        this.defAttrs.forEach(attr => {
          this.channelsService.getChannel(attr.channel).subscribe(
            (chan: Channel) => {
              this.defChans[attr.channel] = chan.name;
            },
          );
        });

        this.getState();

        this.editAttrs = [];
        this.defAttrs.forEach(attr => {
          this.editAttrs.push({ ...attr });
        });
        if (this.defAttrs.length) {
          this.editAttr = { ...this.defAttrs[this.defAttrs.length - 1] };
        }
      },
    );
  }

  getChannels() {
    this.channelsService.getChannels(0, 100).subscribe(
      (chans: any) => {
        this.channels = chans.channels;
      },
    );
  }

  getState() {
    this.stateTime = new Date();
    this.defAttrs.forEach(attr => {
      const chan = attr.channel;
      const subtopic = attr.subtopic;
      this.channelsService.connectedThings(chan).subscribe(
        (things: any) => {
          const th: Thing = things.things[0];
          th && this.setStateAttribute(attr.name, chan, th.key, subtopic);
        },
      );
    });
  }

  setStateAttribute(name: string, chan: string, key: string, subtopic: string) {
    this.messagesService.getMessages(chan, key, undefined, subtopic, 0, 1).subscribe(
      (msgs: any) => {
        if (!msgs.messages) {
          return;
        }

        const value = this.parseValue(msgs.messages[0]);
        if (!value) return;

        this.state[name] = this.state[name] || {};
        this.state[name].value = value;
        this.state[name].time = msgs.messages[0].time * 1000;
      },
    );
  }

  parseValue(message: MainfluxMsg): any {
    return message.value || message.bool_value ||
      message.string_value || message.data_value || message.sum;
  }

  showStates() {
    const route = this.router.routerState.snapshot.url.replace('details', 'states');
    this.router.navigate([route]);
  }

  showDefinitions() {
    const route = this.router.routerState.snapshot.url.replace('details', 'definitions');
    this.router.navigate([route]);
  }

  // definition editor
  togglePersist(checked: boolean) {
    this.editAttr.persist_state = checked;
  }

  removeAttribute(attr: Attribute) {
    this.editAttrs.splice(this.editAttrs.indexOf(attr), 1);
  }

  selectAttribute(attr: Attribute) {
    this.editAttr = { ...attr };
  }

  addAttribute() {
    if (!this.editAttr.name) {
      if (this.editAttr.subtopic) {
        this.notificationsService.warn('Using subtopic as attribute name', '');
        this.editAttr.name = this.editAttr.subtopic;
      } else {
        this.notificationsService.error('Attribute name missing', '');
        return;
      }
    }
    if (!this.editAttr.channel) {
      this.notificationsService.error('Attribute channel missing', '');
      return;
    }

    const attr = this.editAttrs.find(a => a.name === this.editAttr.name);
    if (attr) {
      attr.name = this.editAttr.name;
      attr.channel = this.editAttr.channel;
      attr.subtopic = this.editAttr.subtopic;
      attr.persist_state = this.editAttr.persist_state;
    } else {
      this.editAttrs.push({ ...this.editAttr });
    }
  }

  updateDefinition() {
    if (!this.editAttrs.length) {
      this.notificationsService.error('Empty definition', '');
      return;
    }
    const twin: Twin = {
      id: this.twin.id,
      definition: {
        attributes: this.editAttrs,
        delta: this.defDelta,
      },
    };
    this.twinsService.editTwin(twin).subscribe(
      resp => {
        this.getTwin(this.twin.id);
      },
    );
  }

  delta(event: any) {
    const val = +event.srcElement.value;
    this.defDelta = typeof(val) === 'number' ? val * 1e6 : this.defDelta;
  }

  ngOnDestroy() {
    window.clearInterval(this.stateIntervalID);
  }
}
