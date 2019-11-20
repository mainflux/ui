import { Component, Inject } from '@angular/core';

import { NbAuthService, NB_AUTH_OPTIONS, NbLogoutComponent } from '@nebular/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-logout',
  template: '',
})
export class LogoutComponent extends NbLogoutComponent {

  constructor(
    @Inject(NB_AUTH_OPTIONS) protected options: {},
    protected authService: NbAuthService,
    protected router: Router,
  ) {
    super(authService, options, router);
  }

  logout() {
    this.authService.logout('email').subscribe(
      respAuth => {
        localStorage.removeItem('auth_app_token');
        this.router.navigateByUrl('/auth/login');
      },
    );
  }
}
