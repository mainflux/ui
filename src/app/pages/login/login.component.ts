import { Component, Inject,  ChangeDetectorRef } from '@angular/core';

import { NbAuthService,NbAuthResult, NB_AUTH_OPTIONS, NbLoginComponent } from '@nebular/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-login',
  template: '',
})
export class LoginComponent extends NbLoginComponent {
  // strategy inherited

  constructor(service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options: {},
    protected cd: ChangeDetectorRef,
        protected router: Router
  ) {
    super(service, options,cd, router);

    this.service.authenticate(this.strategy, this.user).subscribe((result: NbAuthResult) => {
        this.submitted = false;
        console.log("authentication")
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
