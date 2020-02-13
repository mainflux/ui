import { Component, OnInit } from '@angular/core';
import { DetailsComponent } from 'app/shared/details/details.component';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { ConfirmationComponent } from 'app/shared/confirmation/confirmation.component';
import { DbReaderService } from 'app/common/services/dbreader/dbreader.service';
import { ThingsService } from 'app/common/services/things/things.service';

@Component({
  selector: 'ngx-dbreader',
  templateUrl: './dbreader.component.html',
  styleUrls: ['./dbreader.component.scss'],
})
export class DbReaderComponent implements OnInit {
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
      name: {
        title: 'Name',
        type: 'string',
        placeholder: 'Search name',
        filter: {
          placeholder: 'Search name',
        },
      },
      id: {
        title: 'ID',
        editable: 'false',
        addable: false,
        filter: false,
      },
      details: {
        title: 'Details',
        type: 'custom',
        renderComponent: DetailsComponent,
        valuePrepareFunction: (cell, row) => {
          row.type = 'dbreader';
          return row;
        },
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

  dbReaderNodes = [];

  browseServerURI = '';
  browseNamespace = '';
  browseIdentifier = '';
  browsedNodes = [];
  checkedNodes = [];

  offset = 0;
  limit = 20;

  constructor(
    private dbReaderService: DbReaderService,
    private thingsService: ThingsService,
    private notificationsService: NotificationsService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.getDbReaderNodes();
  }

  getDbReaderNodes(): void {
    this.dbReaderNodes = [];

    this.dbReaderService.getNodes(this.offset, this.limit).subscribe(
      (resp: any) => {
        resp.things.forEach(node => {
          this.dbReaderNodes.push(node);
          this.source.load(this.dbReaderNodes);
          this.source.refresh();
        });
      },
    );
  }

  onCreateConfirm(event): void {
    // Check name
    if (event.newData.name !== '') {
      // close create row
      event.confirm.resolve();

      this.dbReaderService.addNode(event.newData).subscribe(
        resp => {
          setTimeout(
            () => {
              this.getDbReaderNodes();
            }, 3000,
          );
        },
      );
    } else {
      this.notificationsService.warn('Name is required', '');
    }
  }

  onEditConfirm(event): void {
    // close edditable row
    event.confirm.resolve();

    this.thingsService.editThing(event.newData).subscribe(
      resp => {
        this.notificationsService.success('DB Reader successfully edited', '');
      },
    );
  }

  onDeleteConfirm(event): void {
    this.dialogService.open(ConfirmationComponent, { context: { type: 'DB Reader' } }).onClose.subscribe(
      confirm => {
        if (confirm) {
          event.confirm.resolve();

          this.dbReaderService.deleteNode(event.data).subscribe();
        }
      },
    );
  }
}
