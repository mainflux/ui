import { Component, Input, Output, EventEmitter } from '@angular/core';

import { MainfluxMsg, DateFilter } from 'app/common/interfaces/mainflux.interface';

@Component({
  selector: 'ngx-message-table',
  templateUrl: './message-table.component.html',
  styleUrls: ['./message-table.component.scss'],
})
export class MessageTableComponent {
  @Input() messages: MainfluxMsg[];
  @Output() dateEvent: EventEmitter<DateFilter> = new EventEmitter();

  mode: string = 'table';
  modes: string[] = ['json', 'table'];

  getRangeDate(event) {
    if (event.start && event.end) {
      const dateFilter: DateFilter = {
        from: new Date(event.start).getTime() / 1000,
        to: new Date(event.end).getTime() / 1000,
      };
      this.dateEvent.emit(dateFilter);
    }
  }
}
