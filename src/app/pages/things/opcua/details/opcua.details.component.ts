import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LoraService } from 'app/common/services/lora/lora.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { OpcuaNode } from 'app/common/interfaces/opcua.interface';

@Component({
  selector: 'ngx-opcua-details-component',
  templateUrl: './opcua.details.component.html',
  styleUrls: ['./opcua.details.component.scss'],
})
export class OpcuaDetailsComponent implements OnInit {
  opcuaNode: OpcuaNode = {
    name: '',
  };
  messages = [];

  constructor(
    private route: ActivatedRoute,
    private loraService: LoraService,
    private messagesService: MessagesService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.loraService.getDevice(id).subscribe(
      resp => {
        this.opcuaNode = resp;

        this.messagesService.getMessages(this.opcuaNode.metadata.channelID,
          this.opcuaNode.key, this.opcuaNode.id).subscribe(
          (msgResp: any) => {
            this.messages = [];
            if (msgResp.messages) {
              this.messages = msgResp.messages;
            }
          },
        );
      },
    );
  }
}
