import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OpcuaService } from 'app/common/services/opcua/opcua.service';
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
    private opcuaService: OpcuaService,
    private messagesService: MessagesService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.opcuaService.getNode(id).subscribe(
      resp => {
        this.opcuaNode = resp;

        this.messagesService.getMessages(this.opcuaNode.metadata.channel_id,
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
