import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserGroup, User, TableConfig, TablePage } from 'app/common/interfaces/mainflux.interface';
import { UsersService } from 'app/common/services/users/users.service';
import { UserGroupsService } from 'app/common/services/users/groups.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'ngx-user-groups-details-component',
  templateUrl: './user-groups.details.component.html',
  styleUrls: ['./user-groups.details.component.scss'],
})
export class UserGroupsDetailsComponent implements OnInit {
  group: UserGroup = {};
  membersPage: TablePage = {};
  unassignedPage: TablePage = {};

  editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;

  usersToAssign: string[] = [];
  usersToUnassign: string[] = [];

  tableConfig: TableConfig = {
    colNames: ['Email', 'ID', 'checkbox'],
    keys: ['email', 'id', 'checkbox'],
  };

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private userGroupsService: UserGroupsService,
    private notificationsService: NotificationsService,
  ) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
    this.editorOptions.mainMenuBar = false;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.userGroupsService.getGroup(id).subscribe(
      (resp: any) => {
        this.group = resp;
        this.getMembers();
      },
    );
  }

  getMembers() {
    this.usersService.getUsers().subscribe(
      (resp: any) => {
        this.unassignedPage.rows = resp.users;
        this.unassignedPage.total = resp.total;
        this.unassignedPage.offset = resp.offset;
        this.unassignedPage.limit = resp.limit;
      },
    );

    this.userGroupsService.getMembers(this.group.id).subscribe(
      resp => {
        this.membersPage.rows = resp.users;
        this.membersPage.total = resp.total;
        this.membersPage.offset = resp.offset;
        this.membersPage.limit = resp.limit;

        if (this.membersPage.total > 0) {
          // Remove members from available Users
          this.membersPage.rows.forEach((m: any) => {
            this.unassignedPage.rows = this.unassignedPage.rows
            .filter((u: any) => u.id !== m.id);
          });
        }
      },
    );
  }

  onAssign() {
    this.userGroupsService.assignUser(this.group.id, this.usersToAssign).subscribe(
      resp => {
        this.notificationsService.success('Successfully assigned User(s) to Group', '');
        this.getMembers();
      },
    );

    if (this.usersToAssign.length === 0) {
      this.notificationsService.warn('User(s) must be provided', '');
    }
  }

  onUnassign() {
    this.userGroupsService.unassignUser(this.group.id, this.usersToUnassign).subscribe(
      resp => {
        this.notificationsService.success('Successfully unassigned User(s) from Group', '');
        this.getMembers();
      },
    );
  }

  onChangeLimitMembers(limit: number) {
    this.membersPage.offset = 0;
    this.membersPage.limit = limit;
    this.getMembers();
  }

  onChangePageMembers(offset: number) {
    this.membersPage.offset = offset;
    this.getMembers();
  }

  onChangeLimitUnassigned(limit: number) {
    this.unassignedPage.offset = 0;
    this.unassignedPage.limit = limit;
  }

  onChangePageUnassigned(offset: any) {
    this.unassignedPage.offset = offset;
  }

  onCheckboxUnassigned(rows: string[]) {
    this.usersToAssign = rows;
  }

  onCheckboxMembers(rows: string[]) {
    this.usersToUnassign = rows;
  }

  onEdit() {
    try {
      this.group.metadata = this.editor.get();
    } catch (e) {
      this.notificationsService.error('Wrong metadata format', '');
      return;
    }

    this.userGroupsService.editGroup(this.group).subscribe(
      resp => {
        this.notificationsService.success('Group metadata successfully edited', '');
      },
    );
  }
}
