import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThingsService } from 'app/common/services/things/things.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { DbReaderDetailsComponent } from '../../details/dbreader.details.component';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChannelsService } from 'app/common/services/channels/channels.service';

@Component({
  selector: 'ngx-mssql',
  templateUrl: './mssql.component.html',
  styleUrls: ['./mssql.component.scss']
})
export class MssqlComponent extends DbReaderDetailsComponent implements OnInit, OnDestroy {
  @Input() thing: any;
  @Input() events: Observable<void>;
  eventsSubscription: any;
  @ViewChild('metadataForm', {static: false}) metadataForm: NgForm;

  constructor(
    protected route: ActivatedRoute,
    protected thingsService: ThingsService,
    protected notificationsService: NotificationsService,
    protected channelsService: ChannelsService,
  ) {
    super(route, thingsService, notificationsService, channelsService);
  }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe(() => this.onEdit());
  }
  onEdit() {
    if (this.metadataForm.valid) {

      if (this.thing.metadata !== '') {
        try {
          // this.thing.metadata = JSON.parse(this.thing.metadata);
        } catch (e) {
          this.notificationsService.error('Wrong metadata format', '');
          return;
        }
      }

      this.thingsService.editThing(this.thing).subscribe(
        resp => {
          this.notificationsService.success('Device metadata successfully edited', '');
        },
      );
    } else {
      for (const key in this.metadataForm.controls) {
        if (this.metadataForm.controls.hasOwnProperty(key)) {
          const control = this.metadataForm.controls[key];
          control.markAsDirty();
        }
      }
    }
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
}
