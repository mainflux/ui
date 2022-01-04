import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { TablePage } from 'app/common/interfaces/mainflux.interface';

@Component({
  selector: 'ngx-pagination-component',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges {
  currentPage = 0;
  totalPages = 0;
  limits = [5, 10, 20, 50, 100];

  @Input() page: TablePage = {};
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
      this.totalPages = Math.ceil(this.page.total / this.page.limit);
    }
  }

  onChangeLimit(lim: number) {
    this.changeLimitEvent.emit(lim);
  }

  onChangePage(dir: string) {
    let offset: number;
    if (dir === 'first' && this.currentPage !== 1) {
      offset = 0;
      this.changePageEvent.emit(offset);
    }
    if (dir === 'prev' && this.currentPage > 1) {
      offset = this.page.offset - this.page.limit;
      this.changePageEvent.emit(offset);
    }
    if (dir === 'next' && this.totalPages > this.currentPage) {
      offset = this.page.offset + this.page.limit;
      this.changePageEvent.emit(offset);
    }
    if (dir === 'last' && this.totalPages > this.currentPage) {
      offset = Math.floor((this.page.total - 1) / this.page.limit) * this.page.limit;
      this.changePageEvent.emit(offset);
    }
  }
}
