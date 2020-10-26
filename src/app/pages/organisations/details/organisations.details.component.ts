import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Organisation, User } from 'app/common/interfaces/mainflux.interface';
import { UsersService } from 'app/common/services/users/users.service';
import { OrganisationsService } from 'app/common/services/users/organisations.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

@Component({
  selector: 'ngx-organisations-details-component',
  templateUrl: './organisations.details.component.html',
  styleUrls: ['./organisations.details.component.scss'],
})
export class OrganisationsDetailsComponent implements OnInit {
  offset = 0;
  limit = 20;

  organisation: Organisation = {};
  users: User[] = [];
  members: User[] = [];

  selectedUsers = [];

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private organisationsService: OrganisationsService,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.organisationsService.getOrganisation(id).subscribe(
      (resp: any) => {
        this.organisation = resp;

        this.getMembers();
      },
    );
  }

  getMembers() {
    this.usersService.getUsers().subscribe(
      (resp: any) => {
        this.users = resp.Users;

        this.organisationsService.getMembers(this.organisation.id).subscribe(
          respMemb => {
            this.members = respMemb.Users;

            // Remove members from available Users
            this.members.forEach(m => {
              this.users = this.users.filter(u => u.id !== m.id);
            });
          },
        );
      },
    );
  }

  onAssign() {
    this.selectedUsers.forEach(u => {
      this.organisationsService.assignUser(this.organisation.id, u.id).subscribe(
        resp => {
          this.notificationsService.success('Successfully assigned User to Organisation', '');
          this.selectedUsers = [];
          this.getMembers();
        },
      );
    });

    if (this.selectedUsers.length === 0) {
      this.notificationsService.warn('User(s) must be provided', '');
    }
  }

  onUnassign(member: any) {
    this.organisationsService.unassignUser(this.organisation.id, member.id).subscribe(
      resp => {
        this.notificationsService.success('Successfully unassigned User from Organisation', '');
        this.selectedUsers = [];
        this.getMembers();
      },
    );
  }
}
