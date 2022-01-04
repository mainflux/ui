import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

import { environment } from 'environments/environment';
import { Channel, PageFilters } from 'app/common/interfaces/mainflux.interface';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { Cert } from 'app/common/interfaces/certs.interface';

@Injectable()
export class CertsService {

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService,
  ) { }

  issueCert(cert: Cert) {
    return this.http.post(environment.certsUrl, cert, { observe: 'response' })
      .map(
          resp => {
            return resp;
          },
        )
      .catch(
        err => {
          this.notificationsService.error('Failed to create Certificate',
            `Error: ${err.status} - ${err.statusText}`);
            return throwError(err);
        },
      );
  }

  listCertsSerials(thingID: string) {
    return this.http.get(`${environment.serialsUrl}/${thingID}`)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to fetch Certificate',
            `Error: ${err.status} - ${err.statusText}`);
          return throwError(err);
        },
      );
  }

  viewCert(serialID: string) {
    return this.http.get(`${environment.certsUrl}/${serialID}`)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to fetch Certificate',
            `Error: ${err.status} - ${err.statusText}`);
          return throwError(err);
        },
      );
  }
}
