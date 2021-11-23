import { Component, Inject,  ChangeDetectorRef } from '@angular/core';

import { NbAuthService, NbAuthResult, NB_AUTH_OPTIONS, NbLoginComponent } from '@nebular/auth';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class LoginComponent extends NbLoginComponent {
  // strategy inherited
  proxyAuth = environment.proxyAuth;

  constructor(
      service: NbAuthService,
      @Inject(NB_AUTH_OPTIONS) protected options: {},
      protected cd: ChangeDetectorRef,
      protected router: Router,
    ) {
    super(service, options, cd, router);

    if ( environment.proxyAuth === true ) {
      this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
        this.submitted = false;
        if (result.isSuccess()) {
          this.messages = result.getMessages();
        } else {
          this.errors = result.getErrors();
        }
        const redirect = result.getRedirect();
        if (redirect) {
          setTimeout(() => {
            return this.router.navigateByUrl(redirect);
          }, this.redirectDelay);
        }
        this.cd.detectChanges();
      });
    }
  }
}
