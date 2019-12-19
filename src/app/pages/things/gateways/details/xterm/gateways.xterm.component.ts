import { Component, Input, OnInit, AfterViewInit,
  ViewChild, ElementRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Gateway } from 'app/common/interfaces/gateway.interface';
import { Message } from 'app/common/interfaces/mainflux.interface';
import { Terminal } from 'xterm';
import { MqttManagerService } from 'app/common/services/mqtt/mqtt.manager.service';
import { MqttConnectionState } from 'ngx-mqtt';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-gateways-xterm',
  templateUrl: './gateways.xterm.component.html',
  styleUrls: ['./gateways.xterm.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GatewaysXtermComponent implements AfterViewInit, OnInit, OnDestroy {
  hbInterval: number = 5 * 1000;
  @Input() gateway: Gateway;
  intervalId: number;
  subscriptions: Subscription[] = new Array();

  public terminal: Terminal;
  @ViewChild('terminal', { static: false }) terminalElement: ElementRef;

  constructor(
    private mqttManagerService: MqttManagerService,
  ) { }

  ngOnInit() {
    const mcSub = this.mqttManagerService.messageChange.subscribe(
      (message: Message) => {
        this.terminal.write(message.vs);
      },
    );
    this.subscriptions.push(mcSub);

    const connPub = this.mqttManagerService.connectChange.subscribe(
      (connectionState: MqttConnectionState) => {
        if (connectionState === MqttConnectionState.CONNECTED) {
          this.intervalId = window.setInterval(function() {
            this.mqttManagerService.publish(this.gateway.metadata.ctrlChannelID, '1', 'keepalive', 'terminal');
          }.bind(this), this.hbInterval);
        }
      },
    );
    this.subscriptions.push(connPub);
  }

  ngAfterViewInit() {
    this.terminal = new Terminal();
    this.terminal.open(this.terminalElement.nativeElement);
    this.terminal.writeln('Welcome to Mainflux IoT Agent');
    this.terminal.write('$ ');
    this.terminal.on('data', function(data: string) {
      this.mqttManagerService.publish(this.gateway.metadata.ctrlChannelID, '1', 'terminal', btoa(data));
    }.bind(this));
  }

  ngOnDestroy() {
    window.clearInterval(this.intervalId);
    this.subscriptions.forEach(
      sub => { sub.unsubscribe(); },
    );
  }
}
