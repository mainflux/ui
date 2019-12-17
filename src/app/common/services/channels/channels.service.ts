import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { environment } from 'environments/environment';
import { Channel } from 'app/common/interfaces/mainflux.interface';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';


@Injectable()
export class ChannelsService {

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService,
  ) { }

  addChannel(channel: Channel) {
    return this.http.post(environment.channelsUrl, channel, { observe: 'response' }).map(
      resp => {
        return resp;
      },
      err => {
        this.notificationsService.error('Failed to create Channel',
          `'Error: ${err.status} - ${err.statusTexts}`);
      },
    );
  }

  getChannel(channel: string) {
    return this.http.get(`${environment.channelsUrl}/${channel}`).map(
      resp => {
        return resp;
      },
      err => {
        this.notificationsService.error('Failed to fetch Channel',
          `'Error: ${err.status} - ${err.statusTexts}`);
      },
    );
  }

  getChannels(offset: number, limit: number, type?: string) {
    let params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    if (type !== undefined) {
      params = params.append('metadata', `{"type":"${type}"}`);
    }

    return this.http.get(environment.channelsUrl, { params }).map(
      resp => {
        return resp;
      },
      err => {
        this.notificationsService.error('Failed to fetch Channels',
          `'Error: ${err.status} - ${err.statusTexts}`);
      },
    );
  }

  editChannel(channel: Channel) {
    return this.http.put(`${environment.channelsUrl}/${channel.id}`, channel).map(
      resp => {
        return resp;
      },
      err => {
        this.notificationsService.error('Failed to edit Channel',
          `'Error: ${err.status} - ${err.statusTexts}`);
      },
    );
  }

  deleteChannel(channelID: string) {
    return this.http.delete(`${environment.channelsUrl}/${channelID}`).map(
      resp => {
        return resp;
      },
      err => {
        this.notificationsService.error('Failed to delete Channel',
          `'Error: ${err.status} - ${err.statusTexts}`);
      },
    );
  }

  connectThing(chanID: string, thingID: string) {
    return this.http.put(`${environment.channelsUrl}/${chanID}/things/${thingID}`, null).map(
      resp => {
        return resp;
      },
      err => {
        this.notificationsService.error('Failed to connect Thing to Channel',
          `'Error: ${err.status} - ${err.statusTexts}`);
      },
    );
  }

  connectThings(channelIDs: string[], thingIDs: string[]) {
    const conReq = {
      channel_ids: channelIDs,
      thing_ids: thingIDs,
    };
    return this.http.post(`${environment.connectUrl}`, conReq).map(
      resp => {
        return resp;
      },
      err => {
        this.notificationsService.error('Failed to connect Things to Channels',
          `'Error: ${err.status} - ${err.statusTexts}`);
      },
    );
  }

  disconnectThing(chanID: string, thingID: string) {
    return this.http.delete(`${environment.channelsUrl}/${chanID}/things/${thingID}`).map(
      resp => {
        return resp;
      },
      err => {
        this.notificationsService.error('Failed to disconnect Thing from Channel',
          `'Error: ${err.status} - ${err.statusTexts}`);
      },
    );
  }

  connectedThings(chanID: string) {
    return this.http.get(`${environment.channelsUrl}/${chanID}/things`).map(
      resp => {
        return resp;
      },
      err => {
        this.notificationsService.error('Failed to fetch connected Things to the Channel',
          `'Error: ${err.status} - ${err.statusTexts}`);
      },
    );
  }
}
