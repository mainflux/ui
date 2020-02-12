import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';

import { NbDialogService } from '@nebular/theme';
import { ConfirmationComponent } from 'app/shared/confirmation/confirmation.component';
import { DetailsComponent } from 'app/shared/details/details.component';

import { TwinsService } from 'app/common/services/twins/twins.service';
import { Twin } from 'app/common/interfaces/mainflux.interface';


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
      name: {
        title: 'Name',
        editable: true,
        addable: true,
      },
      id: {
        title: 'ID',
        editable: false,
        addable: false,
      },
      details: {
        title: 'Details',
        type: 'custom',
        renderComponent: DetailsComponent,
        valuePrepareFunction: (cell, row) => {
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
  twins: Observable<Twin[]>;

  twinsNumber = 0;

  constructor(
    private dialogService: NbDialogService,
    private twinsService: TwinsService,
  ) { }

  ngOnInit() {
    this.getTwins();
  }

  getTwins(): void {
    this.twinsService.getTwins().subscribe(
      (resp: any) => {
        this.twins = resp.twins;
        this.twinsNumber = resp.total;

        // Load and refresh ngx-admin table
        this.source.load(resp.twins);
        this.source.refresh();
      },
    );
  }

  onCreateConfirm(event): void {
    // close edditable row
    event.confirm.resolve();

    this.twinsService.addTwin(event.newData).subscribe(
      resp => {
        this.getTwins();
      },
    );
  }

  onEditConfirm(event): void {
    // close edditable row
    event.confirm.resolve();

    this.twinsService.editTwin(event.newData).subscribe();
  }

  onDeleteConfirm(event): void {
    this.dialogService.open(ConfirmationComponent, { context: { type: 'twin' } }).onClose.subscribe(
      confirm => {
        if (confirm) {
          // close edditable row
          event.confirm.resolve();
          this.twinsService.deleteTwin(event.data.id).subscribe(
            resp => {
              this.getTwins();
            },
          );
        }
      },
    );
  }

  onSelection(event): void {
  }
}
