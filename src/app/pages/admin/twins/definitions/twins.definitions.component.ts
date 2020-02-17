import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TwinsService } from 'app/common/services/twins/twins.service';
import { Twin, Definition } from 'app/common/interfaces/mainflux.interface';

@Component({
  selector: 'ngx-twins-definitions-component',
  templateUrl: './twins.definitions.component.html',
  styleUrls: ['./twins.definitions.component.scss'],
})
export class TwinsDefinitionsComponent implements OnInit {
  twin: Twin = {};
  definitions: Definition[] = [];

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
      },
    );
  }
}
