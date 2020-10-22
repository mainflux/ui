import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { User } from 'app/common/interfaces/mainflux.interface';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

@Injectable()
export class GroupsService {

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService,
  ) { }

  getGroups(): any {
    return this.http.get(environment.groupsUrl)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to fetch groups',
            `Error: ${err.status} - ${err.statusText}`);
            return Observable.throw(err);
        },
      );
  }

  getMemberships(userID?: string): any {
    return this.http.get(`${environment.usersUrl}/${userID}/groups`)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to fetch memberships to groups',
            `Error: ${err.status} - ${err.statusText}`);
            return Observable.throw(err);
        },
      );
  }
}
