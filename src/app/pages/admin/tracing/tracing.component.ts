import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';

@Component({
  selector: 'ngx-tracing',
  templateUrl: './tracing.component.html',
  styleUrls: ['./tracing.component.scss'],
})
export class TracingComponent implements OnInit {
  iframeJaeger: any;

  constructor(
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.iframeJaeger = this.domSanitizer.bypassSecurityTrustResourceUrl(environment.jaegerHome);
  }
}
