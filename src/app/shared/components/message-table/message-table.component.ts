import { Component, Input, Output, EventEmitter } from '@angular/core';

import { MainfluxMsg } from 'app/common/interfaces/mainflux.interface';

@Component({
  selector: 'ngx-message-table',
  templateUrl: './message-table.component.html',
  styleUrls: ['./message-table.component.scss'],
})
export class MessageTableComponent {
  @Input() messages: MainfluxMsg[];
  @Output() dateEvent: EventEmitter<any> = new EventEmitter();

  mode: string = 'table';
  modes: string[] = ['json', 'table'];

  getRangeDate(event) {
    this.dateEvent.emit({from: event.start, to: event.end});
  }
}
