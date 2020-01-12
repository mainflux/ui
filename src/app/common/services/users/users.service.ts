import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { User } from 'app/common/interfaces/mainflux.interface';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

@Injectable()
export class UsersService {
  picture = 'assets/images/mainflux-logo.png';

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService,
  ) { }

  getUser(): any {
    return this.http.get(environment.usersUrl)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to fetch User',
            `Error: ${err.status} - ${err.statusText}`);
            return Observable.throw(err);
        },
      );
  }

  editUser(user: User): any {
    return this.http.put(environment.usersUrl, user)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to edit User',
            `Error: ${err.status} - ${err.statusText}`);
            return Observable.throw(err);
        },
      );
  }

  changeUserPassword(passReq: any): any {
    return this.http.patch(environment.changePassUrl, passReq, { observe: 'response' })
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to change User password',
            `Error: ${err.status} - ${err.statusText}`);
            return Observable.throw(err);
        },
      );
  }

  getUserPicture(): any {
    return this.picture;
  }
}
