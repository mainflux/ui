import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserGroup, User } from 'app/common/interfaces/mainflux.interface';
import { UsersService } from 'app/common/services/users/users.service';
import { UserGroupsService } from 'app/common/services/users/groups.service';
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
  userGroups: UserGroup[] = [];
  memberships: UserGroup[] = [];

  selectedGroups = [];

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private userGroupsService: UserGroupsService,
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
    this.userGroupsService.getGroups().subscribe(
      (resp: any) => {
        this.userGroups = resp.Groups;

        this.usersService.getMemberships(this.user.id).subscribe(
          (respMemb: any) => {
            this.memberships = respMemb.Groups;

            // Remove memberships from available User Groups
            this.memberships.forEach(m => {
              this.userGroups = this.userGroups.filter(o => o.id !== m.id);
            });
          },
        );
      },
    );
  }

  onAssign() {
    this.selectedGroups.forEach(o => {
      this.userGroupsService.assignUser(o.id, this.user.id).subscribe(
        resp => {
          this.notificationsService.success('Successfully assigned User to Group', '');
          this.selectedGroups = [];
          this.getMemberships();
        },
      );
    });

    if (this.selectedGroups.length === 0) {
      this.notificationsService.warn('User Group(s) must be provided', '');
    }
  }

  onUnassign(memberhip: any) {
    this.userGroupsService.unassignUser(memberhip.id, this.user.id).subscribe(
      resp => {
        this.notificationsService.success('Successfully unassigned User from Group', '');
        this.selectedGroups = [];
        this.getMemberships();
      },
    );
  }
}
