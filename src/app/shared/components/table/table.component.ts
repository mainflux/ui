import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { TablePage } from 'app/common/interfaces/mainflux.interface';

@Component({
  selector: 'ngx-table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnChanges {
  currentPage = 0;
  totalPages = 0;
  limits = [5, 10, 20, 50, 100];

  @Input() colNames: string[] = [];
  @Input() keys: string[] = [];
  @Input() page: TablePage = {};
  @Input() options: any[] = [];
  @Output() delEvent: EventEmitter<any> = new EventEmitter();
  @Output() changeLimitEvent: EventEmitter<any> = new EventEmitter();
  @Output() changePageEvent: EventEmitter<any> = new EventEmitter();
  constructor(
  ) { }

  ngOnChanges() {
    if (this.page !== undefined) {
      // Ceil offset by limit ratio
      const pageNum = (this.page.offset + 1) / this.page.limit;
      this.currentPage = Math.ceil(pageNum);
      // Calculate the number of pages
      this.totalPages = this.page.total / this.page.limit;
    }
  }

  onDelete(row: any) {
    this.delEvent.emit(row);
  }

  onChangeLimit(lim: number) {
    this.changeLimitEvent.emit(lim);
  }

  onChangePage(dir: any) {
    if (dir === 'prev' && this.currentPage > 1) {
      this.changePageEvent.emit(dir);
    }
    if (dir === 'next' && this.totalPages > this.currentPage) {
      this.changePageEvent.emit(dir);
    }
  }
}
