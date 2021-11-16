import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { TableConfig, TablePage } from 'app/common/interfaces/mainflux.interface';

@Component({
  selector: 'ngx-table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnChanges {
  isObject(val: any): boolean { return typeof val === 'object'; }
  selected = [];
  isSelectedAll = false;

  @Input() config: TableConfig = {};
  @Input() page: TablePage = {};
  @Output() editEvent: EventEmitter<any> = new EventEmitter();
  @Output() delEvent: EventEmitter<any> = new EventEmitter();
  @Output() detailsEvent: EventEmitter<any> = new EventEmitter();
  @Output() checkEvent: EventEmitter<any> = new EventEmitter();
  constructor(
  ) { }

  ngOnChanges() {
    // Reset checkbox state and emit empty check event
    this.isSelectedAll = false;
    this.selected = [];
    this.checkEvent.emit(this.selected);
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

  onToggleCheckbox(row: any) {
    const index = this.selected.indexOf(row.id);
    (index > -1) ? this.selected.splice(index, 1) : this.selected.push(row.id);
    this.checkEvent.emit(this.selected);
  }

  onToggleSelectAll(event) {
    this.isSelectedAll = event;

    if (!this.page.rows) {
      return;
    }

    // Update rows checked status with event state
    this.page.rows.forEach((row: any) => {
      row.checked = event;
    });

    // Update selected list with IDs
    if (event) {
      this.selected = this.page.rows.map((row: any) => row.id);
    } else {
      this.selected = [];
    }

    this.checkEvent.emit(this.selected);
  }
}
