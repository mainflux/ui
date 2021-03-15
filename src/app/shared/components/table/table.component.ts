import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { TableConfig, TablePage } from 'app/common/interfaces/mainflux.interface';

@Component({
  selector: 'ngx-table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnChanges {
  currentPage = 0;
  totalPages = 0;

  @Input() config: TableConfig = {};
  @Input() page: TablePage = {};
  @Output() editEvent: EventEmitter<any> = new EventEmitter();
  @Output() delEvent: EventEmitter<any> = new EventEmitter();
  @Output() detailsEvent: EventEmitter<any> = new EventEmitter();
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

  onClickDetails(row: any) {
    this.detailsEvent.emit(row);
  }

  onEdit(row: any) {
    this.editEvent.emit(row);
  }

  onDelete(row: any) {
    this.delEvent.emit(row);
  }
}
