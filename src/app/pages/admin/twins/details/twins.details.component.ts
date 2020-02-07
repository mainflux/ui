import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ChannelsService } from 'app/common/services/channels/channels.service';
import { TwinsService } from 'app/common/services/twins/twins.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { Twin, Thing, Channel, Attribute } from 'app/common/interfaces/mainflux.interface';

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
  defAttrs: Attribute[] = [];
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
    this.twinsService.getTwin(id).subscribe(
      resp => {
        this.twin = <Twin>resp;

        this.defAttrs = this.twin.definitions[
          this.twin.definitions.length - 1].attributes;

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
        this.state[name] = this.state[name] || {};
        this.state[name].value = msgs.messages[0] && msgs.messages[0].value;
        this.state[name].time = msgs.messages[0].time * 1000;
      },
    );
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
    if (!this.editAttr.name || !this.editAttr.channel) {
      this.notificationsService.error('Missing attribute info', '');
      return;
    }

    this.editAttrs.push({ ...this.editAttr });
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
      },
    };
    this.twinsService.editTwin(twin).subscribe(
      resp => {
        this.getTwin(this.twin.id);
      },
    );
  }

  ngOnDestroy() {
    window.clearInterval(this.stateIntervalID);
  }
}
