import { Component, OnInit } from '@angular/core';

import { NbDialogService } from '@nebular/theme';

import { LocalDataSource } from 'ng2-smart-table';
import { Thing } from 'app/common/interfaces/mainflux.interface';

import { ThingsService } from 'app/common/services/things/things.service';
import { FsService } from 'app/common/services/fs/fs.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { ConfirmationComponent } from 'app/shared/components/confirmation/confirmation.component';
import { DetailsComponent } from 'app/shared/components/details/details.component';

const defFreq: number = 100;

@Component({
  selector: 'ngx-things-component',
  templateUrl: './things.component.html',
  styleUrls: ['./things.component.scss'],
})
export class ThingsComponent implements OnInit {
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
      type: {
        title: 'Type',
        filter: false,
        addable: true,
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
  things: Thing[] = [];

  offset = 0;
  limit = 100;
  total = 0;

  searchFreq = 0;
  columnChar = '|';

  constructor(
    private dialogService: NbDialogService,
    private thingsService: ThingsService,
    private fsService: FsService,
    private notificationsService: NotificationsService,
  ) { }

  ngOnInit() {
    this.getThings();
  }

  getThings(name?: string): void {
    this.thingsService.getThings(this.offset, this.limit, '', '', name).subscribe(
      (resp: any) => {
        this.total = resp.total;
        this.things = resp.things;

        // Check if there is a type defined in the metadata
        this.things.forEach( (thing: Thing) => {
          thing.type = thing.metadata ? thing.metadata.type : '';
        });

        // Load and refresh Things table
        this.source.load(this.things);
        this.source.refresh();
      },
    );
  }

  onCreateConfirm(event): void {
    // close create row
    event.confirm.resolve();

    event.newData.type && (event.newData.metadata = {'type': event.newData.type});
    this.thingsService.addThing(event.newData).subscribe(
      resp => {
        this.notificationsService.success('Thing successfully created', '');
        this.getThings();
      },
    );
  }

  onEditConfirm(event): void {
    // close edit row
    event.confirm.resolve();

    const type = event.newData.type;
    if (type) {
      event.newData.metadata = event.newData.metadata || {};
      event.newData.metadata.type = type;
    }

    this.thingsService.editThing(event.newData).subscribe(
      resp => {
        this.notificationsService.success('Thing successfully edited', '');
      },
    );
  }

  onDeleteConfirm(event): void {
    this.dialogService.open(ConfirmationComponent, { context: { type: 'Thing' } }).onClose.subscribe(
      confirm => {
        if (confirm) {
          // close delete row
          event.confirm.resolve();

          this.thingsService.deleteThing(event.data.id).subscribe(
            resp => {
              this.things = this.things.filter(t => t.id !== event.data.id);
              this.notificationsService.success('Thing successfully deleted', '');
            },
          );
        }
      },
    );
  }

  searchThing(input) {
    const t = new Date().getTime();
    if ((t - this.searchFreq) > defFreq) {
      this.getThings(input);
      this.searchFreq = t;
    }
  }

  onClickSave() {
    this.fsService.exportToCsv('mfx_things.csv', this.things);
  }

  onFileSelected(files: FileList) {
    if (files && files.length > 0) {
      const file: File = files.item(0);
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const csv: string = reader.result as string;
        const lines = csv.split('\n');
        const things: Thing[] = [];

        lines.forEach( line => {
          const col = line.split(this.columnChar);
          const name = col[0];
          if (name !== '' && name !== '<empty string>') {
            let metadata = {};
            if (col[1] !== undefined) {
              try {
                metadata = JSON.parse(col[1]);
              } catch (e) {
                this.notificationsService.warn('Wrong metadata format', '');
              }
            }
            const thing = {
              name: name,
              metadata: metadata,
            };
            things.push(thing);
          }
        });

        this.thingsService.addThings(things).subscribe(
          resp => {
            this.getThings();
          },
        );
      };
    }
  }
}
