import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';

@Injectable()
export class VersionsService {

  constructor(private http: HttpClient) { }

  getUsersVersion() {
    return this.http.get(environment.usersVersionUrl);
  }

  getThingsVersion() {
    return this.http.get(environment.thingsVersionUrl);
  }

  getNormalizerVersion() {
    return this.http.get(environment.normalizerVersionUrl);
  }

  getHTTPVersion() {
    return this.http.get(environment.httpVersionUrl);
  }

  getWebsocketVersion() {
    return this.http.get(environment.websocketVersionUrl);
  }

  getWriterVersion() {
    return this.http.get(environment.writerVersionUrl);
  }

  getReaderVersion() {
    return this.http.get(environment.readerVersionUrl);
  }

}
