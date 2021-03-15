import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TwinsService } from 'app/common/services/twins/twins.service';
import { Twin, TableConfig, TablePage, PageFilters } from 'app/common/interfaces/mainflux.interface';
import { isNumber } from 'util';

@Component({
  selector: 'ngx-twins-states-component',
  templateUrl: './twins.states.component.html',
  styleUrls: ['./twins.states.component.scss'],
})
export class TwinsStatesComponent implements OnInit, OnDestroy {
  lowerLimit = 0;
  upperLimit = 10;
  interval = 5 * 1000;
  intervalID: number;

  twin: Twin = {};

  twinID: string = '';
  tableConfig: TableConfig = {
    colNames: ['ID', 'Definition', 'Created', 'Payload'],
    keys: ['id', 'definition', 'created', 'payload'],
  };
  statesPage: TablePage = {};
  pageFilters: PageFilters = {};

  constructor(
    private route: ActivatedRoute,
    private twinsService: TwinsService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.getTwin(id);
  }

  getTwin(id: string) {
    this.twinsService.getTwin(id).subscribe(
      (resp: Twin) => {
        this.twin = resp;
        this.getStates();
        this.intervalID = window.setInterval(() => {
          this.getStates();
        }, this.interval);
      },
    );
  }

  getStates() {
    this.twinsService.listStates(this.twin.id, this.pageFilters.offset, this.pageFilters.limit).subscribe(
      (resp: any) => {
        this.statesPage = {
          offset: resp.offset,
          limit: resp.limit,
          total: resp.total,
          rows: resp.states,
        };
      },
    );
  }

  lower($event) {
    const val = +$event.srcElement.value;
    if (isNumber(val)) {
      this.lowerLimit = val;

      this.pageFilters.offset = val - 1;
      this.pageFilters.offset = Math.max(0, this.pageFilters.offset);
      this.pageFilters.limit = this.upperLimit - this.pageFilters.offset;
      this.pageFilters.limit = Math.max(0, this.pageFilters.limit);

      this.getStates();
    }
  }

  upper($event) {
    const val = +$event.srcElement.value;

    if (isNumber(val)) {
      this.upperLimit = val;

      this.pageFilters.limit = val - this.pageFilters.offset;
      this.pageFilters.limit = Math.max(0, this.pageFilters.limit);
      this.pageFilters.offset = this.lowerLimit - 1;
      this.pageFilters.offset = Math.max(0, this.pageFilters.offset);

      this.getStates();
    }
  }

  ngOnDestroy() {
    window.clearInterval(this.intervalID);
  }

  onChangePage(dir: any) {
    if (dir === 'prev') {
      this.pageFilters.offset = this.statesPage.offset - this.statesPage.limit;
    }
    if (dir === 'next') {
      this.pageFilters.offset = this.statesPage.offset + this.statesPage.limit;
    }
    this.getStates();
  }

  onChangeLimit(lim: number) {
    this.pageFilters.limit = lim;
    this.getStates();
  }
}
