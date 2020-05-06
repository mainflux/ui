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

  constructor(
    private router: Router,
  ) { }

  onOpenDetailsPage() {
    if (this.value.id) {
      this.router.navigate([`${this.router.routerState.snapshot.url}/details/${this.value.id}`]);
    }
  }
}
