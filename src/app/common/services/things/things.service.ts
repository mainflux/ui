import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { Thing } from 'app/common/interfaces/mainflux.interface';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

const defLimit: number = 20;
const defConnLimit: number = 5;

@Injectable()
export class ThingsService {

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService,
  ) { }

  addThing(thing: Thing) {
    return this.http.post(environment.thingsUrl, thing, { observe: 'response' })
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to create Thing',
            `Error: ${err.status} - ${err.statusText}`);
          return Observable.throw(err);
        },
      );
  }

  addThings(things: Thing[]) {
    return this.http.post(`${environment.thingsUrl}/bulk`, things, { observe: 'response' })
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to create Things',
            `Error: ${err.status} - ${err.statusText}`);
          return Observable.throw(err);
        },
      );
  }

  getThing(thingID: string) {
    return this.http.get(`${environment.thingsUrl}/${thingID}`)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to fetch Thing',
            `Error: ${err.status} - ${err.statusText}`);
          return Observable.throw(err);
        },
      );
  }

  getThings(offset?: number, limit?: number, type?: string, metaValue?: string, name?: string) {
    offset = offset || 0;
    limit = limit || defLimit;

    let params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString())
      .set('order', 'name')
      .set('dir', 'asc');

    if (type) {
      if (metaValue) {
        params = params.append('metadata', `{"${type}": ${metaValue}}`);
      } else {
        params = params.append('metadata', `{"type":"${type}"}`);
      }
    }

    if (name) {
      params = params.append('name', name);
    }

    return this.http.get(environment.thingsUrl, { params })
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to get Things',
            `Error: ${err.status} - ${err.statusText}`);
          return Observable.throw(err);
        },
      );
  }

  deleteThing(thingID: string) {
    return this.http.delete(`${environment.thingsUrl}/${thingID}`)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to delete Thing',
            `Error: ${err.status} - ${err.statusText}`);
          return Observable.throw(err);
        },
      );
  }

  editThing(thing: Thing) {
    return this.http.put(`${environment.thingsUrl}/${thing.id}`, thing)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to edit Thing',
            `Error: ${err.status} - ${err.statusText}`);
          return Observable.throw(err);
        },
      );
  }

  connectedChannels(thingID: string, offset?: number, limit?: number) {
    offset = offset || 0;
    limit = limit || defConnLimit;

    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    return this.http.get(`${environment.thingsUrl}/${thingID}/channels/`,  { params })
    .map(
      resp => {
        return resp;
      },
    )
    .catch(
      err => {
        this.notificationsService.error('Failed to fetch connected Chanels to the Thing',
          `Error: ${err.status} - ${err.statusText}`);
        return Observable.throw(err);
      },
    );
  }

  disconnectedChannels(thingID: string, offset?: number, limit?: number) {
    offset = offset || 0;
    limit = limit || defLimit;

    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString())
      .set('connected', 'false');

    return this.http.get(`${environment.thingsUrl}/${thingID}/channels`, { params })
    .map(
      resp => {
        return resp;
      },
    )
    .catch(
      err => {
        this.notificationsService.error('Failed to fetch not connected Channels to the Thing',
          `Error: ${err.status} - ${err.statusText}`);
        return Observable.throw(err);
      },
    );
  }
}
