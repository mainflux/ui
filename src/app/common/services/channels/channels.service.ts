import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

import { environment } from 'environments/environment';
import { Channel, PageFilters } from 'app/common/interfaces/mainflux.interface';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

const defLimit: number = 10;

@Injectable()
export class ChannelsService {

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService,
  ) { }

  addChannel(channel: Channel) {
    return this.http.post(environment.channelsUrl, channel, { observe: 'response' })
      .map(
          resp => {
            return resp;
          },
        )
      .catch(
        err => {
          this.notificationsService.error('Failed to create Channel',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  addChannels(channels: Channel[]) {
    return this.http.post(`${environment.channelsUrl}/bulk`, channels, { observe: 'response' })
      .map(
          resp => {
            return resp;
          },
        )
      .catch(
        err => {
          this.notificationsService.error('Failed to create Channels',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  getChannel(channel: string) {
    return this.http.get(`${environment.channelsUrl}/${channel}`)
      .map(
          resp => {
            return resp;
          },
        )
      .catch(
        err => {
          this.notificationsService.error('Failed to fetch Channel',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  getChannels(filters: PageFilters) {
    filters.offset = filters.offset || 0;
    filters.limit = filters.limit || defLimit;

    let params = new HttpParams()
      .set('offset', filters.offset.toString())
      .set('limit', filters.limit.toString())
      .set('order', 'name')
      .set('dir', 'asc')
      .set('metadata', filters.metadata);


    if (filters.name) {
      params = params.append('name', filters.name);
    }

    return this.http.get(environment.channelsUrl, { params })
      .map(
          resp => {
            return resp;
          },
        )
      .catch(
        err => {
          this.notificationsService.error('Failed to fetch Channels',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  editChannel(channel: Channel) {
    return this.http.put(`${environment.channelsUrl}/${channel.id}`, channel)
      .map(
          resp => {
            return resp;
          },
        )
      .catch(
        err => {
          this.notificationsService.error('Failed to edit Channel',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  deleteChannel(channelID: string) {
    return this.http.delete(`${environment.channelsUrl}/${channelID}`)
      .map(
          resp => {
            return resp;
          },
        )
      .catch(
        err => {
          this.notificationsService.error('Failed to delete Channel',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  connectThing(chanID: string, thingID: string) {
    return this.http.put(`${environment.channelsUrl}/${chanID}/things/${thingID}`, null)
      .map(
          resp => {
            return resp;
          },
        )
      .catch(
        err => {
          this.notificationsService.error('Failed to connect Thing to Channel',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  connectThings(channelIDs: string[], thingIDs: string[]) {
    const conReq = {
      channel_ids: channelIDs,
      thing_ids: thingIDs,
    };
    return this.http.post(`${environment.connectUrl}`, conReq)
      .map(
          resp => {
            return resp;
          },
        )
      .catch(
        err => {
          this.notificationsService.error('Failed to connect Thing(s) to Channel(s)',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  disconnectThing(chanID: string, thingID: string) {
    return this.http.delete(`${environment.channelsUrl}/${chanID}/things/${thingID}`)
      .map(
          resp => {
            return resp;
          },
        )
      .catch(
        err => {
          this.notificationsService.error('Failed to disconnect Thing from Channel',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  disconnectThings(channelIDs: string[], thingIDs: string[]) {
    const conReq = {
      channel_ids: channelIDs,
      thing_ids: thingIDs,
    };
    return this.http.put(`${environment.disconnectUrl}`, conReq)
      .map(
          resp => {
            return resp;
          },
        )
      .catch(
        err => {
          this.notificationsService.error('Failed to disconnect Thing(s) from Channel(s)',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  connectedThings(chanID: string, offset?: number, limit?: number) {
    offset = offset || 0;
    limit = limit || defLimit;

    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    return this.http.get(`${environment.channelsUrl}/${chanID}/things`, { params })
    .map(
        resp => {
          return resp;
        },
      )
    .catch(
      err => {
        this.notificationsService.error('Failed to fetch connected Things to the Channel',
          `Error: ${err.status} - ${err.statusText}`);
          return throwError(err);
      },
    );
  }

  disconnectedThings(chanID: string, offset?: number, limit?: number) {
    offset = offset || 0;
    limit = limit || defLimit;

    const params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString())
      .set('disconnected', 'true');

    return this.http.get(`${environment.channelsUrl}/${chanID}/things`, { params })
    .map(
        resp => {
          return resp;
        },
      )
    .catch(
      err => {
        this.notificationsService.error('Failed to fetch not connected Things to the Channel',
          `Error: ${err.status} - ${err.statusText}`);
          return throwError(err);
      },
    );
  }
}
