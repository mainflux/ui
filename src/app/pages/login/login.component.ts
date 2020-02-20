import { Component, ChangeDetectorRef, Inject } from '@angular/core';

import { NbAuthService, NB_AUTH_OPTIONS, NbLoginComponent } from '@nebular/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-login',
  templateUrl: 'login.component.html',
})
export class LoginComponent extends NbLoginComponent {

  constructor(
    @Inject(NB_AUTH_OPTIONS) protected options: {},
    protected authService: NbAuthService,
    protected cd: ChangeDetectorRef,
    protected router: Router,
  ) {
    super(authService, options, cd, router);
  }
}
