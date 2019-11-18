import { Component, ChangeDetectorRef, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbAuthService, NB_AUTH_OPTIONS, NbResetPasswordComponent } from '@nebular/auth';

@Component({
  selector: 'ngx-reset',
  templateUrl: 'reset-password.component.html',
})
export class ResetPasswordComponent extends NbResetPasswordComponent implements OnInit  {
  token = '';

  constructor(
    @Inject(NB_AUTH_OPTIONS) protected options: {},
    protected service: NbAuthService,
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private route: ActivatedRoute,
  ) {
    super(service, options, cd, router);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.user.token = params['token'];
      },
    );
  }
}
