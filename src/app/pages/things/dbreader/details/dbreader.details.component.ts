import { Component, OnInit } from '@angular/core';
import { Thing } from 'app/common/interfaces/mainflux.interface';
import { ActivatedRoute } from '@angular/router';
import { ThingsService } from 'app/common/services/things/things.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { DbTypes, DbType } from 'app/common/interfaces/dbreader.interface';
import { MsSQLServerClass } from 'app/common/classes/mssql.class';
import { CSVClass } from 'app/common/classes/csv.class';
import { Subject } from 'rxjs';
import { ChannelsService } from 'app/common/services/channels/channels.service';

@Component({
  selector: 'ngx-dbreader-details-component',
  templateUrl: './dbreader.details.component.html',
  styleUrls: ['./dbreader.details.component.scss'],
})
export class DbReaderDetailsComponent implements OnInit {
  thing: Thing = {};

  selectedDbType = null;
  dbTypes = DbTypes;

  eventsSubject: Subject<void> = new Subject<void>();

  offset = 0;
  limit = 20;

  constructor(
    protected route: ActivatedRoute,
    protected thingsService: ThingsService,
    protected notificationsService: NotificationsService,
    protected channelsService: ChannelsService,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.thingsService.getThing(id).subscribe(
      resp => {
        this.thing = <Thing>resp;
        this.selectedDbType = this.thing.metadata.db_reader_data &&
          this.thing.metadata.db_reader_data.dbtype;
      },
    );
  }

  onDbTypeSelect(value: any) {
    switch (value) {
      case DbType.MICROSOFT_SQL_SERVER:
        this.thing.metadata.db_reader_data = new MsSQLServerClass();
        break;
      case DbType.CSV:
        this.thing.metadata.db_reader_data = new CSVClass();
        break;
      default:
        return;
    }
    this.thing.metadata.db_reader_data.dbtype = value;
  }

  onEdit() {
    this.eventsSubject.next();
  }
}
