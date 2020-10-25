import { Component, OnInit } from '@angular/core';

import { NbDialogService } from '@nebular/theme';

import { LocalDataSource } from 'ng2-smart-table';
import { User } from 'app/common/interfaces/mainflux.interface';

import { UsersService } from 'app/common/services/users/users.service';
import { FsService } from 'app/common/services/fs/fs.service';
import { ConfirmationComponent } from 'app/shared/confirmation/confirmation.component';
import { DetailsComponent } from 'app/shared/details/details.component';

const defFreq: number = 100;

@Component({
  selector: 'ngx-users-component',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
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
      email: {
        title: 'Email',
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
  users: User[] = [];
  user: User;

  offset = 0;
  limit = 100;
  total = 0;


  searchFreq = 0;

  constructor(
    private dialogService: NbDialogService,
    private usersService: UsersService,
    private fsService: FsService,
  ) { }

  ngOnInit() {
    // Fetch all useers
    this.getUsers();
  }

  getUsers(email?: string): void {
    this.usersService.getUsers(this.offset, this.limit, email).subscribe(
      (resp: any) => {
        this.total = resp.total;
        this.users = resp.Users;

        // Load and refresh Users table
        this.source.load(this.users);
        this.source.refresh();
      },
    );
  }

  onCreateConfirm(event): void {
    // close edditable row
    event.confirm.resolve();
  }

  onEditConfirm(event): void {
    // close edditable row
    event.confirm.resolve();

  }

  searchUsersbyEmail(input) {
    const t = new Date().getTime();
    if ((t - this.searchFreq) > defFreq) {
      this.getUsers(input);
      this.searchFreq = t;
    }
  }

  onClickSave() {
    this.fsService.exportToCsv('mfx_users.csv', this.users);
  }

  onDeleteConfirm(event): void {
    this.dialogService.open(ConfirmationComponent, { context: { type: 'User' } }).onClose.subscribe(
      confirm => {
        if (confirm) {
          // close edditable row
          event.confirm.resolve();
        }
      },
    );
  }

  onFileSelected(files: FileList) {
  }
}
