import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-details-access',
  templateUrl: './details.component.html',
})
export class DetailsComponent {
  // Depends on valuePrepareFunction in ng2-smart-table
  value: {id: string};

  constructor(
    private router: Router,
  ) { }

  onOpenDetailsPage() {
    if (this.value.id) {
      this.router.navigate([`${this.router.routerState.snapshot.url}/details/${this.value.id}`]);
    }
  }
}
