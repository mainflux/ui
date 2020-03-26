import { Component, Input,Output, EventEmitter, AfterViewInit,
  ViewChild, ElementRef, ViewEncapsulation, OnDestroy, OnInit } from '@angular/core';
import { Gateway, Message } from 'app/common/interfaces/models';
import { Terminal } from 'xterm';
import { MqttService, IMqttMessage, MqttConnectionState } from 'ngx-mqtt';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { NgTerminal } from 'ng-terminal';
import { Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'ngx-gateways-xterm',
  templateUrl: './gateways.xterm.component.html',
  styleUrls: ['./gateways.xterm.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GatewaysXtermComponent implements AfterViewInit, OnInit,  OnDestroy {
  hbInterval: number = 5 * 1000;
  @Input() gateway: Gateway;
  intervalId: number;
  subscriptions: Subscription[] = new Array();
  uuid: String;

  chanSub: Subscription;
  stateSub: Subscription;
  //public terminal: Terminal;

 // @ViewChild('terminal', { static: false }) terminalElement: ElementRef;
  @ViewChild('term', { static: true }) terminal: NgTerminal;

  constructor(
    private mqttService: MqttService,
    private notificationsService: NotificationsService,
  ) { }

  
  ngOnChanges() {
    if (this.gateway === undefined )
      return
    console.log("ngOnInit")
    const term = this.terminal;
    const channel = this.gateway.metadata.ctrlChannelID;
    if ( this.gateway.id && this.gateway.metadata.ctrlChannelID){
      this.mqttService.connect({ username: this.gateway.id, password: this.gateway.key });
      this.stateSub = this.mqttService.state.subscribe(this.subToState.bind(this));
    }
  }

  subToState(state: MqttConnectionState) {
    if (state === MqttConnectionState.CONNECTED) {
      this.notificationsService.success('Connected to MQTT broker', '');
      this.subToChan();
    }
  }

  subToChan() {
    // var term: Terminal;
    // term = new Terminal();
    // term.open(this.terminalElement.nativeElement);
    const topic = `channels/${this.gateway.metadata.ctrlChannelID}/messages/res`
    const term = this.terminal;
    this.chanSub = this.mqttService.observe(topic).subscribe(
      (message: IMqttMessage) => {
        var res: string;
        const pl = message.payload.toString();
        res = JSON.parse(pl);
        term.write(res[0].vs)
      });
    this.notificationsService.success(`Subscribed to channel ${this.gateway.metadata.ctrlChannelID}`, '');
  }


  publish(channel: string, bn: string, n: string, vs: string) {
    const topic = `${this.createTopic(channel)}/req`;
    const t = Date.now()
    const payload = this.createPayload(bn, n, t, vs);
    this.mqttService.publish(topic, payload).subscribe();
  }

  createTopic(channel: string) {
    return `channels/${channel}/messages`;
  }

  createPayload(baseName: string, name: string, time:number, valueString: string) {
    return `[{"bn":"${baseName}:", "n":"${name}", "vs":"${valueString}"}]`;
    //return `[{"bn":"${baseName}:", "n":"${name}", "t":"${time}", "vs":"${valueString}"}]`;
  }

  ngAfterViewInit() {
    // this.terminal = new Terminal();
    // this.terminal.open(this.terminalElement.nativeElement);
    this.terminal.write('Welcome to \x1B[1;3;31terminal\x1B[0m');
    var id = uuid();
 
    this.terminal.keyEventInput.subscribe(e =>{
      console.log('keyboard event:' + e.domEvent.keyCode + ', ' + e.key);
      const ev = e.domEvent;
      this.publish(this.gateway.metadata.ctrlChannelID, id, 'term', ev.key);
    })
  }

  ngOnDestroy() {
    this.stateSub && this.stateSub.unsubscribe();
    this.chanSub && this.chanSub.unsubscribe();
    this.mqttService.disconnect();
  }
}
