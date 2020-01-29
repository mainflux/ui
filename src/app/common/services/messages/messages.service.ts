import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { ThingsService } from 'app/common/services/things/things.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

@Injectable()
export class MessagesService {

  constructor(
    private http: HttpClient,
    private thingsService: ThingsService,
    private notificationsService: NotificationsService,
  ) { }

  getMessages(channel: string, key: string, thingID?: string, subtopic?: string, offset?: number, limit?: number) {
    offset = offset || 0;
    limit = limit || 500;

    let params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    if (thingID !== undefined) {
      params = params.append('publisher', thingID);
    }

    const headers = new HttpHeaders({
      'Authorization': key,
    });

    const topic = subtopic ? `${environment.readerChannelsUrl}/${channel}/messages/${subtopic}` : `${environment.readerChannelsUrl}/${channel}/messages`;

    return this.http.get(topic, { headers: headers, params: params })
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

    return this.http.post(`${environment.writerChannelsUrl}/${channel}/messages`, msg, { headers: headers })
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

  sendTempMock(chanID: string, thingID: string) {
    const temp1 = 28 + 2 * Math.random();
    const temp2 = 28 + 2 * Math.random();
    const temp3 = 28 + 3 * Math.random();
    const temp4 = 28 + 4 * Math.random();
    const temp5 = 28 + 10 * Math.random();
    const temp6 = 28 + 10 * Math.random();
    const temp7 = 28 + 10 * Math.random();
    const temp8 = 28 + 10 * Math.random();

    const message = `[{"bt": 15020, "bn":"temperature", "t": 0, "v":${temp1}},
                      {"t":10, "v":${temp2}}, {"t":20, "v":${temp3}},
                      {"t":30, "v":${temp4}}, {"t":40, "v":${temp5}},
                      {"t":50, "v":${temp6}}, {"t":60, "v":${temp7}},
                      {"t":70, "v":${temp8}}]`;

    this.thingsService.getThing(thingID).subscribe(
      (resp: any) => {
        this.sendMessage(chanID, resp.key, message).subscribe(
          () => {
          },
          err => {
            this.notificationsService.error('Failed to send messages mock',
              `Error: ${err.status} - ${err.statusText}`);
          },
        );
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
