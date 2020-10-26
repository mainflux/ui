import { Component, OnInit } from '@angular/core';

import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';

import { Organisation } from 'app/common/interfaces/mainflux.interface';
import { OrganisationsService } from 'app/common/services/users/organisations.service';
import { FsService } from 'app/common/services/fs/fs.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { ConfirmationComponent } from 'app/shared/confirmation/confirmation.component';
import { DetailsComponent } from 'app/shared/details/details.component';

const defFreq: number = 100;

@Component({
  selector: 'ngx-organisations-component',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss'],
})
export class OrganisationsComponent implements OnInit {
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
  organisations: Organisation[] = [];

  offset = 0;
  limit = 100;
  total = 0;

  searchFreq = 0;

  constructor(
    private dialogService: NbDialogService,
    private organisationsService: OrganisationsService,
    private fsService: FsService,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit() {
    // Fetch all Organisations
    this.getOrganisations();
  }

  getOrganisations(name?: string): void {
    this.organisationsService.getOrganisations(this.offset, this.limit, name).subscribe(
      (resp: any) => {
        this.total = resp.total;
        this.organisations = resp.Groups;

        // Load and refresh Organisations table
        this.source.load(this.organisations);
        this.source.refresh();
      },
    );
  }

  onCreateConfirm(event): void {
    // close edditable row
    event.confirm.resolve();

    this.organisationsService.addOrganisation(event.newData).subscribe(
      resp => {
        this.notificationsService.success('Organisation successfully created', '');
        this.getOrganisations();
      },
    );
  }

  onEditConfirm(event): void {
    // close edditable row
    event.confirm.resolve();

    const orgReq = {
      name: event.newData.name,
      description: event.newData.description,
    };

    this.organisationsService.editOrganisation(event.newData).subscribe(
      resp => {
        this.notificationsService.success('Organisation successfully edited', '');
      },
    );
  }

  searchOrgsbyName(input) {
    const t = new Date().getTime();
    if ((t - this.searchFreq) > defFreq) {
      this.getOrganisations(input);
      this.searchFreq = t;
    }
  }

  onClickSave() {
    this.fsService.exportToCsv('mfx_organisations.csv', this.organisations);
  }

  onDeleteConfirm(event): void {
    this.dialogService.open(ConfirmationComponent, { context: { type: 'Organisation' } }).onClose.subscribe(
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
