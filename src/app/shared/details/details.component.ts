import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-details-access',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  // Depends on valuePrepareFunction
  value: any;
  title: any;

  constructor(
    private router: Router,
  ) { }

  onOpenDetailsPage() {
    let route = '';

    if (this.value.type === 'gateway') {
      route = 'things/gateways/details';
    }

    if (this.value.type === 'loraDevice') {
      route = 'things/lora/details';
    }

    if (this.value.type === 'channel') {
      route = 'things/channels/details';
    }

    if (this.value.type === 'device') {
      route = 'things/devices/details';
    }

    this.router.navigate([`/pages/${route}/${this.value.id}`]);
  }
}
