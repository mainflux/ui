import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TwinsService } from 'app/common/services/twins/twins.service';
import { LocalDataSource } from 'ng2-smart-table';
import { TwinsAttributesComponent } from './attributes/twins.attributes.component';
import { Twin, Definition } from 'app/common/interfaces/mainflux.interface';

@Component({
  selector: 'ngx-twins-definitions-component',
  templateUrl: './twins.definitions.component.html',
  styleUrls: ['./twins.definitions.component.scss'],
})
export class TwinsDefinitionsComponent implements OnInit {
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
        filter: false,
      },
      attributes: {
        title: 'Attributes',
        type: 'custom',
        renderComponent: TwinsAttributesComponent,
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

  twin: Twin = {};
  definitions: Definition[] = [];
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
        this.definitions = this.twin.definitions;
        this.source.load(this.definitions);
      },
    );
  }
}
