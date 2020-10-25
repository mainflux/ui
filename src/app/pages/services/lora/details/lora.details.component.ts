import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LoraService } from 'app/common/services/lora/lora.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { LoraDevice } from 'app/common/interfaces/lora.interface';

@Component({
  selector: 'ngx-lora-details-component',
  templateUrl: './lora.details.component.html',
  styleUrls: ['./lora.details.component.scss'],
})
export class LoraDetailsComponent implements OnInit {
  loraDevice: LoraDevice = {
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
        this.loraDevice = resp;

        this.messagesService.getMessages(
          this.loraDevice.metadata.channel_id, this.loraDevice.key, this.loraDevice.id).subscribe(
          (msgResp: any) => {
            if (msgResp.messages) {
              this.messages = msgResp.messages;
            }
          },
        );
      },
    );
  }
}
