import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from 'app/common/interfaces/mainflux.interface';
import { UsersService } from 'app/common/services/users/users.service';
import { OrganisationsService } from 'app/common/services/users/organisations.service';


@Component({
  selector: 'ngx-users-details-component',
  templateUrl: './users.details.component.html',
  styleUrls: ['./users.details.component.scss'],
})
export class UsersDetailsComponent implements OnInit {
  offset = 0;
  limit = 20;

  user: User = {};
  groups = [];

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private organisationsService: OrganisationsService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.usersService.getUser(id).subscribe(
      (resp: any) => {
        this.user = resp;
      },
    );

    this.usersService.getMemberships(id).subscribe(
      (resp: any) => {
        this.groups = resp.groups;
      },
    );
  }
}
