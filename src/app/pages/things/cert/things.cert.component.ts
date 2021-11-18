import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

import { ThingsService } from 'app/common/services/things/things.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'ngx-things-cert-component',
  templateUrl: './things.cert.component.html',
  styleUrls: ['./things.cert.component.scss'],
})
export class ThingsCertComponent {
  @Input() cert = '';
  @Input() serial = '';
  constructor(
    protected dialogRef: NbDialogRef<ThingsCertComponent>,
    private notificationsService: NotificationsService,
    private clipboardService: ClipboardService,
  ) { }

  submit() {
    this.clipboardService.copyFromContent(this.cert);
    this.dialogRef.close(true);
  }
}
