import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';


const defSearchBarMs: number = 100;

@Component({
  selector: 'ngx-grafana-component',
  templateUrl: './grafana.component.html',
  styleUrls: ['./grafana.component.scss'],
})
export class GrafanaDashComponent implements OnInit {
  
  
  constructor(
    private router: Router,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
  
  }

}
