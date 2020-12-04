import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { ThingsService } from 'app/common/services/things/things.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

const defLimit: number = 100;

@Injectable()
export class MessagesService {


  constructor(
    private http: HttpClient,
    private thingsService: ThingsService,
    private notificationsService: NotificationsService,
  ) { }

  getMessages(channel: string, thingKey: string, thingID?: string, subtopic?: string, offset?: number, limit?: number) {
    offset = offset || 0;
    limit = limit || defLimit;

    const headers = new HttpHeaders({
      'Authorization': thingKey,
    });

    let url = `${environment.readerChannelsUrl}/${channel}/${environment.messagesSufix}`;
    url += `?offset=${offset}&limit=${limit}`;
    url = thingID ? url += `&publisher=${thingID}` : url;
    url = subtopic ? url += `&subtopic=${encodeURIComponent(subtopic)}` : url;

    return this.http.get(url, { headers: headers })
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to read Messages',
            `Error: ${err.status} - ${err.statusText}`);
          return Observable.throw(err);
        },
      );
  }

  sendMessage(channel: string, key: string, msg: string) {
    const headers = new HttpHeaders({
      'Authorization': key,
    });

    return this.http.post(`${environment.writerChannelsUrl}/${channel}/${environment.messagesSufix}`, msg, { headers: headers })
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to send Message',
            `Error: ${err.status} - ${err.statusText}`);
          return Observable.throw(err);
        },
      );
  }

  sendLocationMock(chanID: string, thingID: string) {
    const lon = 44.7 + 0.5 * Math.random();
    const lat = 20.4 + 0.5 * Math.random();

    const message = `[{"bn":"location-", "n":"lon", "v":${lon}}, {"n":"lat", "v":${lat}}]`;

    this.thingsService.getThing(thingID).subscribe(
      (resp: any) => {
        this.sendMessage(chanID, resp.key, message).subscribe();
      },
    );
  }
}
