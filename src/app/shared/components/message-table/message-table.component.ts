import { Component, Input } from '@angular/core';

import { MainfluxMsg } from 'app/common/interfaces/mainflux.interface';

@Component({
  selector: 'ngx-message-table',
  templateUrl: './message-table.component.html',
  styleUrls: ['./message-table.component.scss'],
})
export class MessageTableComponent {
  @Input() messages: MainfluxMsg[];

  mode: string = 'table';
  modes: string[] = ['json', 'table'];
}
