import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Organisation, User } from 'app/common/interfaces/mainflux.interface';
import { UsersService } from 'app/common/services/users/users.service';
import { OrganisationsService } from 'app/common/services/users/organisations.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';


@Component({
  selector: 'ngx-users-details-component',
  templateUrl: './users.details.component.html',
  styleUrls: ['./users.details.component.scss'],
})
export class UsersDetailsComponent implements OnInit {
  offset = 0;
  limit = 20;

  user: User = {};
  organisations: Organisation[] = [];
  memberships: Organisation[] = [];

  selectedOrgs = [];

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private organisationsService: OrganisationsService,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.usersService.getUser(id).subscribe(
      (resp: any) => {
        this.user = resp;

        this.getMemberships();
      },
    );
  }

  getMemberships() {
    this.organisationsService.getOrganisations().subscribe(
      (resp: any) => {
        this.organisations = resp.Groups;

        this.usersService.getMemberships(this.user.id).subscribe(
          (respMemb: any) => {
            this.memberships = respMemb.Groups;

            // Remove memberships from available Organisations
            this.memberships.forEach(m => {
              this.organisations = this.organisations.filter(o => o.id !== m.id);
            });
          },
        );
      },
    );
  }

  onAssign() {
    this.selectedOrgs.forEach(o => {
      this.organisationsService.assignUser(o.id, this.user.id).subscribe(
        resp => {
          this.notificationsService.success('Successfully assigned User to Organisation', '');
          this.selectedOrgs = [];
          this.getMemberships();
        },
      );
    });

    if (this.selectedOrgs.length === 0) {
      this.notificationsService.warn('Oorganisation(s) must be provided', '');
    }
  }

  onUnassign(memberhip: any) {
    this.organisationsService.unassignUser(memberhip.id, this.user.id).subscribe(
      resp => {
        this.notificationsService.success('Successfully unassigned User from Organisation', '');
        this.selectedOrgs = [];
        this.getMemberships();
      },
    );
  }
}
