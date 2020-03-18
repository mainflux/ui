import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TwinsService } from 'app/common/services/twins/twins.service';
import { Twin } from 'app/common/interfaces/mainflux.interface';
import { LocalDataSource } from 'ng2-smart-table';
import { TwinsPayloadComponent } from './payload/twins.payload.component';
import { isNumber } from 'util';

@Component({
  selector: 'ngx-twins-states-component',
  templateUrl: './twins.states.component.html',
  styleUrls: ['./twins.states.component.scss'],
})
export class TwinsStatesComponent implements OnInit, OnDestroy {
  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      id: {
        title: 'ID',
        width: '3%',
      },
      definition: {
        title: 'Definition',
        width: '3%',
      },
      created: {
        title: 'Created',
        valuePrepareFunction: (cell, row) => {
          const date = new Date(row.created);
          return date.toUTCString();
        },
      },
      payload: {
        title: 'Payload',
        type: 'custom',
        renderComponent: TwinsPayloadComponent,
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        filter: false,
      },
    },
    pager: {
      display: true,
      perPage: 10,
    },
  };

  offset = 0;
  limit = 10;
  lowerLimit = 0;
  upperLimit = 10;
  interval = 5 * 1000;
  intervalID: number;

  twin: Twin = {};
  states: any[] = [];
  total: number = 0;
  source: LocalDataSource = new LocalDataSource();

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
        this.getLastStates();
        this.intervalID = window.setInterval(() => {
          this.twinsService.listStates(this.twin.id, 0, 0).subscribe(
            (states: any) => {
              this.total = states.total;
            });
        }, this.interval);
      },
    );
  }

  getLastStates() {
    this.twinsService.listStates(this.twin.id, this.offset, this.limit).subscribe(
      (states: any) => {
        this.offset = states.total - this.limit;
        this.offset = Math.max(0, this.offset);

        this.lowerLimit = this.offset + 1;
        this.upperLimit = this.offset + this.limit;

        this.getStates();
      },
    );
  }

  getStates() {
    this.twinsService.listStates(this.twin.id, this.offset, this.limit).subscribe(
      (states: any) => {
        this.total = states.total;
        this.states = states.states;
        this.source.load(this.states);
        this.source.refresh();
      },
    );
  }

  lower($event) {
    const val = +$event.srcElement.value;
    if (isNumber(val)) {
      this.lowerLimit = val;

      this.offset = val - 1;
      this.offset = Math.max(0, this.offset);
      this.limit = this.upperLimit - this.offset;
      this.limit = Math.max(0, this.limit);

      this.getStates();
    }
  }

  upper($event) {
    const val = +$event.srcElement.value;

    if (isNumber(val)) {
      this.upperLimit = val;

      this.limit = val - this.offset;
      this.limit = Math.max(0, this.limit);
      this.offset = this.lowerLimit - 1;
      this.offset = Math.max(0, this.offset);

      this.getStates();
    }
  }

  ngOnDestroy() {
    window.clearInterval(this.intervalID);
  }

}
