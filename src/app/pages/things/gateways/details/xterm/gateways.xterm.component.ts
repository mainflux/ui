import { Component, Input,Output, EventEmitter, AfterViewInit,
  ViewChild, ElementRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Gateway } from 'app/common/interfaces/gateway.interface';
import { Message } from 'app/common/interfaces/mainflux.interface'
import { Terminal } from 'xterm';
import { MqttService, IMqttMessage, MqttConnectionState } from 'ngx-mqtt';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'ngx-gateways-xterm',
  templateUrl: './gateways.xterm.component.html',
  styleUrls: ['./gateways.xterm.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GatewaysXtermComponent implements AfterViewInit, OnDestroy {
  hbInterval: number = 5 * 1000;
  @Input() gateway: Gateway;
  intervalId: number;
  subscriptions: Subscription[] = new Array();
  uuid: string;
  connected: boolean;

  chanSub: Subscription;
  stateSub: Subscription;
  public terminal: Terminal;

  @ViewChild('terminal', { static: false }) terminalElement: ElementRef;

  constructor(
    private mqttService: MqttService,
    private notificationsService: NotificationsService,
  ) { 
    this.connected = false;
  }

  ngOnChanges() {
    if (this.gateway === undefined || 
        this.terminal === undefined || 
        this.connected === true)
      return
    if ( this.gateway.id && this.gateway.metadata.ctrlChannelID){
      this.mqttService.connect({ username: this.gateway.id, password: this.gateway.key });
      this.stateSub = this.mqttService.state.subscribe(this.connectionHandler.bind(this));
    }
  }

  connectionHandler(state: MqttConnectionState) {
    if (state === MqttConnectionState.CONNECTED) {
      this.connected = true
      this.notificationsService.success('Connected to MQTT broker', '');
      this.connectAgent();
    }
  }

  connectAgent() {
      const topic = `${this.createTopic(this.gateway.metadata.ctrlChannelID)}/res/term`;
      const term = this.terminal;
      this.chanSub = this.mqttService.observe(topic).subscribe(
        (message: IMqttMessage) => {
          var res: string;
          const pl = message.payload.toString();
          const senml = <Message>(<any>message.payload.toString())
          res = JSON.parse(pl);
          const msg = <Message>(<any>res[0]);
          term.write(msg.vs)
        });
      this.notificationsService.success(`Subscribed to channel ${this.gateway.metadata.ctrlChannelID}`, '');
  }

  publish(channel: string, bn: string, n: string, vs: string) {
    const topic = `${this.createTopic(channel)}/req`;
    const t = Date.now()
    const payload = this.createPayload(bn, n, t, vs);
    this.mqttService.publish(topic, payload);
  }

  createTopic(channel: string) {
    return `channels/${channel}/messages`;
  }

  createPayload(baseName: string, name: string, time:number, valueString: string) {
    return `[{"bn":"${baseName}:", "n":"${name}", "vs":"${valueString}"}]`;
    //return `[{"bn":"${baseName}:", "n":"${name}", "t":"${time}", "vs":"${valueString}"}]`;
  }

  ngAfterViewInit() {
    this.terminal = new Terminal();
    this.terminal.open(this.terminalElement.nativeElement);
    this.terminal.writeln('Welcome to Mainflux IoT Agent');
    this.terminal.write('$ ');
    this.uuid = uuid();
    this.terminal.on('data', function(data: string) {
      const vs = `ch, ${data}`;
      this.publish(this.gateway.metadata.ctrlChannelID, this.uuid, 'term', btoa(vs));
    }.bind(this));
  }

  ngOnDestroy() {
    const vs = 'close';
    this.connected = false
    this.publish(this.gateway.metadata.ctrlChannelID, this.uuid, 'term', btoa(vs));
    this.stateSub && this.stateSub.unsubscribe();
    this.chanSub && this.chanSub.unsubscribe();
    this.mqttService.disconnect();
  }
}
