import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { environment } from 'environments/environment';
import { Thing } from 'app/common/interfaces/mainflux.interface';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

@Injectable()
export class ThingsService {

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService,
  ) { }

  addThing(thing: Thing) {
    return this.http.post(environment.thingsUrl, thing, { observe: 'response' }).map(
      resp => {
        return resp;
      },
      err => {
        this.notificationsService.error('Failed to create Device',
          `'Error: ${err.status} - ${err.statusTexts}`);
      },
    );
  }

  getThing(thingID: string) {
    return this.http.get(environment.thingsUrl + '/' + thingID).map(
      resp => {
        return resp;
      },
      err => {
        this.notificationsService.error('Failed to fetch Device',
          `'Error: ${err.status} - ${err.statusTexts}`);
      },
    );
  }

  getThings(offset: number, limit: number, type?: string) {
    let params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    if (type !== undefined) {
      params = params.append('metadata', `{"type":"${type}"}`);
    }

    return this.http.get(environment.thingsUrl, { params });
  }

  deleteThing(thingID: string) {
    return this.http.delete(environment.thingsUrl + '/' + thingID).map(
      resp => {
        return resp;
      },
      err => {
        this.notificationsService.error('Failed to delete Device',
          `'Error: ${err.status} - ${err.statusTexts}`);
      },
    );
  }

  editThing(thing: Thing) {
    return this.http.put(environment.thingsUrl + '/' + thing.id, thing).map(
      resp => {
        return resp;
      },
      err => {
        this.notificationsService.error('Failed to edit Device',
          `'Error: ${err.status} - ${err.statusTexts}`);
      },
    );
  }

  connectedChannels(thingID: string) {
    return this.http.get(environment.thingsUrl  + '/' + thingID + '/channels/');
  }
}
