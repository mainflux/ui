import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/operator/switchMap';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

import { environment } from 'environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private inj: Injector,
    private authService: NbAuthService,
    private router: Router,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService = this.inj.get(NbAuthService);

    if (request.url.startsWith(environment.signupUrl)) {
      return next.handle(request).pipe(tap(
          resp => {
            this.authService.authenticate('email', {
              email: request.body.email,
              password: request.body.password,
            }).subscribe(
              respAuth => {
                this.router.navigateByUrl('/pages/dashboard');
              },
            );
          },
        ),
      );
    }

    return this.authService.getToken().pipe(switchMap(
      (token: NbAuthJWTToken) => {
        if (token && token.getValue() &&
          !request.url.startsWith(environment.writerChannelsUrl) &&
          !request.url.startsWith(environment.readerChannelsUrl) &&
          !request.url.startsWith(environment.bootstrapUrl) &&
          !request.url.startsWith(environment.signupUrl) &&
          !request.url.startsWith(environment.loginUrl)
        ) {
          request = request.clone({
            setHeaders: {
              'Authorization': token.getValue(),
            },
          });
        }
        return next.handle(request).pipe(tap(
          resp => {
          },
          err => {
            // Forbidden - 403 / Gateway Timeout - 504
            if (err instanceof HttpErrorResponse &&
              !request.url.startsWith(environment.writerChannelsUrl) &&
              !request.url.startsWith(environment.readerChannelsUrl) &&
              !request.url.startsWith(environment.bootstrapUrl) &&
              (err.status === 403 || err.status === 504)) {
              localStorage.removeItem('auth_app_token');
              this.router.navigateByUrl('/auth/login');
            }
          },
        ));
      },
    ));
  }
}
