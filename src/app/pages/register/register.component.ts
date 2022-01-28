import { Component, ChangeDetectorRef, Inject } from '@angular/core';

import { NbAuthService, NB_AUTH_OPTIONS, NbRegisterComponent } from '@nebular/auth';
import { Router } from '@angular/router';

import { environment } from 'environments/environment';

@Component({
  selector: 'ngx-register-component',
  templateUrl: 'register.component.html',
})
export class RegisterComponent extends NbRegisterComponent {
  // user inherited
  // strategy inherited
  loginUrl: string;

  constructor(
    @Inject(NB_AUTH_OPTIONS) protected options: {},
    protected authService: NbAuthService,
    protected cd: ChangeDetectorRef,
    protected router: Router,
  ) {
    super(authService, options, cd, router);

    this.loginUrl = environment.appPrefix === ''
                      ? environment.loginUrl
                      : '/' + environment.appPrefix + environment.loginUrl;
  }

  register() {
    this.authService.register(this.strategy, {
      email: this.user.email,
      password: this.user.password,
    }).subscribe(
      respReg => {
        this.authService.authenticate(this.strategy, {
          email: this.user.email,
          password: this.user.password,
        }).subscribe(
          respAuth => {
            this.router.navigateByUrl(this.loginUrl);
          },
        );
      },
    );
  }
}
