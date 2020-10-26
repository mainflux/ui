import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { Organisation } from 'app/common/interfaces/mainflux.interface';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

const defLimit: number = 20;

@Injectable()
export class OrganisationsService {

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService,
  ) { }

  addOrganisation(org: Organisation) {
    return this.http.post(environment.groupsUrl, org, { observe: 'response' })
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to create Organisation',
            `Error: ${err.status} - ${err.statusText}`);
          return Observable.throw(err);
        },
      );
  }

  editOrganisation(org: Organisation) {
    return this.http.patch(`${environment.groupsUrl}/${org.id}`, org)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to edit Organisation',
            `Error: ${err.status} - ${err.statusText}`);
          return Observable.throw(err);
        },
      );
  }

  deleteOrganisation(orgID: string) {
    return this.http.delete(`${environment.groupsUrl}/${orgID}`)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to delete Organisation',
            `Error: ${err.status} - ${err.statusText}`);
          return Observable.throw(err);
        },
      );
  }

  assignUser(groupID: string, userID: string): any {
    return this.http.put(`${environment.groupsUrl}/${groupID}/users/${userID}`, {})
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to Assing User to Organisation',
            `Error: ${err.status} - ${err.statusText}`);
            return Observable.throw(err);
        },
      );
  }

  unassignUser(groupID: string, userID: string): any {
    return this.http.delete(`${environment.groupsUrl}/${groupID}/users/${userID}`)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to Unassing User from Organisation',
            `Error: ${err.status} - ${err.statusText}`);
            return Observable.throw(err);
        },
      );
  }

  getOrganisation(groupID: string): any {
    return this.http.get(`${environment.groupsUrl}/${groupID}`)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to fetch Organisation',
            `Error: ${err.status} - ${err.statusText}`);
            return Observable.throw(err);
        },
      );
  }

  getOrganisations(offset?: number, limit?: number, name?: string): any {
    offset = offset || 0;
    limit = limit || defLimit;

    let params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    if (name) {
      params = params.append('name', name);
    }

    return this.http.get(environment.groupsUrl, { params })
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to fetch Organisations',
            `Error: ${err.status} - ${err.statusText}`);
            return Observable.throw(err);
        },
      );
  }

  getMembers(groupID?: string): any {
    return this.http.get(`${environment.groupsUrl}/${groupID}/users`)
      .map(
        resp => {
          return resp;
        },
      )
      .catch(
        err => {
          this.notificationsService.error('Failed to fetch Organisation members',
            `Error: ${err.status} - ${err.statusText}`);
            return Observable.throw(err);
        },
      );
  }
}
