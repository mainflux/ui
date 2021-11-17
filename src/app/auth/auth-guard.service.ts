import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: NbAuthService, private router: Router) {
      if ( environment.appPrefix !== '' ) {
        this.loginUrl = environment.appPrefix + '/' + this.loginUrl;
      }
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
