import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

import { ThingsService } from 'app/common/services/things/things.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { ClipboardService } from 'ngx-clipboard';
import { CertRes } from 'app/common/interfaces/certs.interface';

@Component({
  selector: 'ngx-things-cert-component',
  templateUrl: './things.cert.component.html',
  styleUrls: ['./things.cert.component.scss'],
})
export class ThingsCertComponent implements OnInit {
  certRes: CertRes = {};

  constructor(
    protected dialogRef: NbDialogRef<ThingsCertComponent>,
    private notificationsService: NotificationsService,
    private clipboardService: ClipboardService,
  ) { }

  ngOnInit() {
    if (this.certRes.client_key) {
      this.notificationsService.warn('Copy the client key somewhere safe!', '');
    }
  }

  submit() {
    this.clipboardService.copyFromContent(this.certRes.client_key ? this.certRes.client_key : this.certRes.client_cert);
    this.dialogRef.close(true);
  }
}
