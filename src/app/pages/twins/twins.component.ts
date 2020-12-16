import { Component, OnInit } from '@angular/core';

import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';

import { Twin } from 'app/common/interfaces/mainflux.interface';
import { TwinsService } from 'app/common/services/twins/twins.service';
import { FsService } from 'app/common/services/fs/fs.service';
import { ConfirmationComponent } from 'app/shared/confirmation/confirmation.component';
import { DetailsComponent } from 'app/shared/details/details.component';

@Component({
  selector: 'ngx-twins',
  templateUrl: './twins.component.html',
  styleUrls: ['./twins.component.scss'],
})
export class TwinsComponent implements OnInit {
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
        editable: true,
        addable: true,
        filter: false,
      },
      created: {
        title: 'Created',
        editable: false,
        addable: false,
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return new Date(cell).toLocaleString();
        },
      },
      updated: {
        title: 'Updated',
        editable: false,
        addable: false,
        filter: false,
        valuePrepareFunction: (cell, row) => {
          return new Date(cell).toLocaleString();
        },
      },
      revision: {
        title: 'Revision',
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
  twins: Twin[] = [];

  searchTime = 0;

  constructor(
    private dialogService: NbDialogService,
    private twinsService: TwinsService,
    private fsService: FsService,
  ) { }

  ngOnInit() {
    this.getTwins();
  }

  getTwins(): void {
    this.twinsService.getTwins().subscribe(
      (resp: any) => {
        this.twins = resp.twins;

        // Load and refresh Twins table
        this.source.load(resp.twins);
        this.source.refresh();
      },
    );
  }

  onCreateConfirm(event): void {
    // close create row
    event.confirm.resolve();

    this.twinsService.addTwin(event.newData).subscribe(
      resp => {
        this.getTwins();
      },
    );
  }

  onEditConfirm(event): void {
    // close edit row
    event.confirm.resolve();

    this.twinsService.editTwin(event.newData).subscribe();
  }

  onDeleteConfirm(event): void {
    this.dialogService.open(ConfirmationComponent, { context: { type: 'twin' } }).onClose.subscribe(
      confirm => {
        if (confirm) {
          // close delete row
          event.confirm.resolve();
          this.twinsService.deleteTwin(event.data.id).subscribe(
            resp => {
              this.twins = this.twins.filter(t => t.id !== event.data.id);
            },
          );
        }
      },
    );
  }

  onSaveFile() {
    this.fsService.exportToCsv('twins.csv', this.twins);
  }

  onFileSelected(files: FileList) {
  }

  searchTwin(input) {
  }
}
