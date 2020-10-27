import { Component, OnInit } from '@angular/core';

import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';

import { UserGroup } from 'app/common/interfaces/mainflux.interface';
import { UserGroupsService } from 'app/common/services/users/groups.service';
import { FsService } from 'app/common/services/fs/fs.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { ConfirmationComponent } from 'app/shared/confirmation/confirmation.component';
import { DetailsComponent } from 'app/shared/details/details.component';

const defFreq: number = 100;

@Component({
  selector: 'ngx-user-groups-component',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss'],
})
export class UserGroupsComponent implements OnInit {
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      details: {
        type: 'custom',
        renderComponent: DetailsComponent,
        valuePrepareFunction: (cell, row) => {
          return row;
        },
        editable: false,
        addable: false,
        filter: false,
      },
      name: {
        title: 'Name',
        filter: false,
      },
      description: {
        title: 'Description',
        filter: false,
      },
      id: {
        title: 'ID',
        editable: false,
        addable: false,
        filter: false,
      },
    },
    pager: {
      display: true,
      perPage: 6,
    },
  };

  source: LocalDataSource = new LocalDataSource();
  userGroups: UserGroup[] = [];

  offset = 0;
  limit = 100;
  total = 0;

  searchFreq = 0;

  constructor(
    private dialogService: NbDialogService,
    private userGroupsService: UserGroupsService,
    private fsService: FsService,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit() {
    // Fetch all User Groups
    this.getUserGroups();
  }

  getUserGroups(name?: string): void {
    this.userGroupsService.getUserGroups(this.offset, this.limit, name).subscribe(
      (resp: any) => {
        this.total = resp.total;
        this.userGroups = resp.Groups;

        // Load and refresh User Groups table
        this.source.load(this.userGroups);
        this.source.refresh();
      },
    );
  }

  onCreateConfirm(event): void {
    // close create row
    event.confirm.resolve();

    this.userGroupsService.addGroup(event.newData).subscribe(
      resp => {
        this.notificationsService.success('User Group successfully created', '');
        this.getUserGroups();
      },
    );
  }

  onEditConfirm(event): void {
    // close edit row
    event.confirm.resolve();

    this.userGroupsService.editGroup(event.newData).subscribe(
      resp => {
        this.notificationsService.success('User Group successfully edited', '');
      },
    );
  }

  searchOrgsbyName(input) {
    const t = new Date().getTime();
    if ((t - this.searchFreq) > defFreq) {
      this.getUserGroups(input);
      this.searchFreq = t;
    }
  }

  onClickSave() {
    this.fsService.exportToCsv('mfx_user_groups.csv', this.userGroups);
  }

  onDeleteConfirm(event): void {
    this.dialogService.open(ConfirmationComponent, { context: { type: 'User Group' } }).onClose.subscribe(
      confirm => {
        if (confirm) {
          // close delete row
          event.confirm.resolve();

          this.userGroupsService.deleteGroup(event.data.id).subscribe(
            resp => {
              this.userGroups = this.userGroups.filter(o => o.id !== event.data.id);
              this.notificationsService.success('User Group successfully deleted', '');
            },
          );
        }
      },
    );
  }

  onFileSelected(files: FileList) {
  }
}
