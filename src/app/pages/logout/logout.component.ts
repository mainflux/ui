import { Component, Inject } from '@angular/core';

import { NbAuthService, NB_AUTH_OPTIONS, NbLogoutComponent } from '@nebular/auth';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'ngx-logout',
  template: '',
})
export class LogoutComponent extends NbLogoutComponent {
  // strategy inherited
  loginUrl = '/auth/login';
  constructor(
    @Inject(NB_AUTH_OPTIONS) protected options: {},
    protected authService: NbAuthService,
    protected router: Router,
  ) {
    super(authService, options, router);
    if (environment.appPrefix !== '') {
      this.loginUrl = '/' + environment.appPrefix + '/auth/login';
    } 
  }

  logout() {
    this.authService.logout(this.strategy).subscribe(
      respAuth => {
        localStorage.removeItem('auth_app_token');
        this.router.navigateByUrl(this.loginUrl);
      },
    );
  }
}
