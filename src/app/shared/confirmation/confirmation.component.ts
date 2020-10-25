import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent {
  constructor(protected dialogRef: NbDialogRef<ConfirmationComponent>) { }

  @Input() type: string;

  cancel() {
    this.dialogRef.close(false);
  }

  submit() {
    this.dialogRef.close(true);
  }
}
