import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ThingsService } from 'app/common/services/things/things.service';
import { TwinsService } from 'app/common/services/twins/twins.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { Thing, Twin, Channel } from 'app/common/interfaces/mainflux.interface';


@Component({
  selector: 'ngx-twins-details-component',
  templateUrl: './twins.details.component.html',
  styleUrls: ['./twins.details.component.scss'],
})
export class TwinsDetailsComponent implements OnInit, OnDestroy {
  offset = 0;
  limit = 100;

  twin: Twin = {};
  thing: Thing = {};
  defAttrs = {};
  channels: Channel[] = [];
  twinName: string;

  attrs = {};
  attrName: string = '';
  attrSubtopic: string = '';
  attrChannel: string = '';
  attrPersist: boolean = false;

  state = {};
  stateInterval = 5 * 1000;
  stateIntervalID: number;
  stateTime: number;

  things = [];
  selectedThing: Thing = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private thingsService: ThingsService,
    private twinsService: TwinsService,
    private notificationsService: NotificationsService,
    private messagesService: MessagesService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.getTwin(id);
    this.getThings();
  }

  getTwin(id: string) {
    this.twinsService.getTwin(id).subscribe(
      resp => {
        this.twin = <Twin>resp;

        this.defAttrs = this.twin.definitions[
          this.twin.definitions.length - 1].attributes;
        Object.keys(this.defAttrs).forEach(key => {
          this.attrs[key] = this.defAttrs[key];
        });

        this.getThing();
      },
    );
  }

  getThing() {
    this.thingsService.getThing(this.twin.thing_id).subscribe(
      (th: Thing) => {
        this.thing = th;
        this.getChannels();
        this.getState();
        this.stateIntervalID = window.setInterval(this.getState.bind(this), this.stateInterval);
      },
    );
  }

  getChannels() {
    this.thingsService.connectedChannels(this.thing.id).subscribe(
      (chans: any) => {
        this.channels = chans.channels;
      },
    );
  }

  getState() {
    this.state = {};
    Object.keys(this.defAttrs).forEach(k => {
      const chan = this.defAttrs[k].channel;
      const subtopic = this.defAttrs[k].subtopic;
      this.messagesService.getMessages(chan, this.thing.key, subtopic).subscribe(
        (msgs: any) => {
          this.state[k] = msgs.messages[0].value;
          this.stateTime = msgs.messages[0].time * 1000;
        },
      );
    });
  }

  getThings() {
    this.thingsService.getThings(this.offset, this.limit).subscribe(
      (respThings: any) => {
        this.things = <Thing[]>respThings.things;
      },
    );
  }

  updateInfo() {
    const twin: Twin = {
      id: this.twin.id,
      thing_id: this.selectedThing.id || this.twin.thing_id,
      name: this.twinName || this.twin.name,
    };

    this.twinsService.editTwin(twin).subscribe(
      resp => {
        this.getTwin(this.twin.id);
      },
    );
  }

  // definition & attributes
  updateDefinition() {
    if (!Object.keys(this.attrs).length) {
      return;
    }
    const twin: Twin = {
      id: this.twin.id,
      definition: {},
    };
    twin.definition.attributes = this.attrs;
    this.twinsService.editTwin(twin).subscribe(
      resp => {
        this.getTwin(this.twin.id);
      },
    );
  }

  togglePersist(checked: boolean) {
    this.attrPersist = checked;
  }

  removeAttribute(key) {
    delete this.attrs[key];
  }

  selectAttribute(attr) {
    this.attrName = attr.key;
    this.attrChannel = attr.value.channel;
    this.attrSubtopic = attr.value.subtopic;
    this.attrPersist = attr.value.persist_state;
  }

  updateAttribute() {
    if (!this.attrName || !this.attrChannel) {
      this.notificationsService.error('Missing attribute info', '');
      return;
    }

    this.attrs[this.attrName] = {
      channel: this.attrChannel,
      subtopic: this.attrSubtopic,
      persist_state: this.attrPersist,
    };
  }

  // states
  showStates() {
    const route = this.router.routerState.snapshot.url.replace('details', 'states');
    this.router.navigate([route]);
  }

  ngOnDestroy() {
    window.clearInterval(this.stateIntervalID);
  }
}
