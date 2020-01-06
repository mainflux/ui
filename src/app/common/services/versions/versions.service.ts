import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';

@Injectable()
export class VersionsService {

  constructor(private http: HttpClient) { }

  getUsersVersion() {
    return this.http.get(environment.usersVersionUrl);
  }
}
