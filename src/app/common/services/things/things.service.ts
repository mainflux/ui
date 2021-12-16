import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

import { environment } from 'environments/environment';
import { Thing, PageFilters } from 'app/common/interfaces/mainflux.interface';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

const defLimit: number = 10;

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
          return throwError(err);
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
          return throwError(err);
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
          return throwError(err);
        },
      );
  }

  getThings(filters: PageFilters) {
    filters.offset = filters.offset || 0;
    filters.limit = filters.limit || defLimit;

    let params = new HttpParams()
      .set('offset', filters.offset.toString())
      .set('limit', filters.limit.toString())
      .set('order', 'name')
      .set('dir', 'asc');

    if (filters.type) {
      if (filters.metadata) {
        params = params.append('metadata', `{"${filters.type}": ${filters.metadata}}`);
      } else {
        params = params.append('metadata', `{"type":"${filters.type}"}`);
      }
    }

    if (filters.name) {
      params = params.append('name', filters.name);
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
          return throwError(err);
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
          return throwError(err);
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
          return throwError(err);
        },
      );
  }

  connectedChannels(thingID: string, offset?: number, limit?: number) {
    offset = offset || 0;
    limit = limit || defLimit;

    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString())
      .set('order', 'name')
      .set('dir', 'asc');

    return this.http.get(`${environment.thingsUrl}/${thingID}/channels/`,  { params })
    .map(
      resp => {
        return resp;
      },
    )
    .catch(
      err => {
        this.notificationsService.error('Failed to fetch connected Channels to the Thing',
          `Error: ${err.status} - ${err.statusText}`);
        return throwError(err);
      },
    );
  }

  disconnectedChannels(thingID: string, offset?: number, limit?: number) {
    offset = offset || 0;
    limit = limit || defLimit;

    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString())
      .set('disconnected', 'true')
      .set('order', 'name')
      .set('dir', 'asc');

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
        return throwError(err);
      },
    );
  }
}
