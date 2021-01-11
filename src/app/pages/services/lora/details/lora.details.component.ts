import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LoraService } from 'app/common/services/lora/lora.service';
import { MessagesService } from 'app/common/services/messages/messages.service';
import { LoraDevice } from 'app/common/interfaces/lora.interface';
import { MsgFilters } from 'app/common/interfaces/mainflux.interface';

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

  filters: MsgFilters = {
    offset: 0,
    limit: 20,
    publisher: '',
    subtopic: '',
    from: 0,
    to: 0,
  };

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
        this.filters.publisher = this.loraDevice.id;

        this.messagesService.getMessages(
          this.loraDevice.metadata.channel_id, this.loraDevice.key, this.filters).subscribe(
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
