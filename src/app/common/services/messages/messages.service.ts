import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

import { environment } from 'environments/environment';
import { ThingsService } from 'app/common/services/things/things.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

import { MsgFilters, ReaderUrl, SenMLRec } from 'app/common/interfaces/mainflux.interface';

const defLimit: number = 100;
const thingSchemePrefix = 'Thing ';
const ctAppJsonSenml = 'application/senml+json';

@Injectable()
export class MessagesService {


  constructor(
    private http: HttpClient,
    private thingsService: ThingsService,
    private notificationsService: NotificationsService,
  ) { }

  getMessages(channel: string, filters: MsgFilters, readerUrl?: ReaderUrl) {
    filters.offset = filters.offset || 0;
    filters.limit = filters.limit || defLimit;

    const prefix  = readerUrl ? readerUrl.prefix : environment.readerPrefix;
    const suffix  = readerUrl ? readerUrl.suffix : environment.readerSuffix;

    let url = `${environment.readerUrl}/${prefix}/${channel}/${suffix}?`;

    Object.keys(filters).forEach(key => {
      url = filters[key] ? url += `&${key}=${filters[key]}` : url;
    });

    return this.http.get(url)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to read Messages',
            `Error: ${err.status} - ${err.statusText}`);
          return throwError(err);
        },
      );
  }

  sendSenML(channel: string, key: string, senml: any, subtopic?: string) {
    const headers = new HttpHeaders({
      'Authorization': thingSchemePrefix + key,
      'Content-Type': ctAppJsonSenml,
    });

    let url = `${environment.httpAdapterUrl}/${environment.readerPrefix}/${channel}/${environment.readerSuffix}`;
    url = subtopic ? url += `/${encodeURIComponent(subtopic)}` : url;

    return this.http.post(url, senml, { headers: headers })
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to send Message',
            `Error: ${err.status} - ${err.statusText}`);
          return throwError(err);
        },
      );
  }

  sendLocationMock(chanID: string, thingID: string) {
    const lon = 44.7 + 0.5 * Math.random();
    const lat = 20.4 + 0.5 * Math.random();

    const senml = [
      {
        bn: 'location-',
        n: 'lon',
        v: lon,
      }, {
        n: 'lat',
        v: lat,
      },
    ];

    this.thingsService.getThing(thingID).subscribe(
      (resp: any) => {
        this.sendSenML(chanID, resp.key, senml).subscribe();
      },
    );
  }
}
