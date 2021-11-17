import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable()
export class AuthGuard implements CanActivate {
    loginUrl: String;

    constructor(private authService: NbAuthService, private router: Router) {
      this.loginUrl = environment.appPrefix === '' ? 'auth/login' : environment.appPrefix + '/' + 'auth/login';
    }

    canActivate() {
        return this.authService.isAuthenticated()
          .pipe(
            tap(authenticated => {
              if (!authenticated) {
                this.router.navigate(['auth/login']);
              }
            }),
        );
    }
}
