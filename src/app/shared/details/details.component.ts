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
    this.router.navigate([`/pages/things/${this.value.type}/details/${this.value.id}`]);
  }
}
