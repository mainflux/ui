import { Component, Input, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

import { ThingsService } from 'app/common/services/things/things.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'ngx-things-add-component',
  templateUrl: './things.add.component.html',
  styleUrls: ['./things.add.component.scss'],
})
export class ThingsAddComponent {
  editorMetadata = '';

  @Input() formData = {
    name: '',
    type: '',
    metadata: {
      type: '',
    },
  };
  @Input() action: string = '';

  editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;

  constructor(
    protected dialogRef: NbDialogRef<ThingsAddComponent>,
    private thingsService: ThingsService,
    private notificationsService: NotificationsService,
  ) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
    this.editorOptions.mainMenuBar = false;
  }

  cancel() {
    this.dialogRef.close(false);
  }

  submit() {
    try {
      const editor: any = this.editor.get();
      this.formData.metadata = editor;
    } catch (e) {
      this.notificationsService.warn('Wrong metadata format', '');
      return;
    }

    this.formData.type && (this.formData.metadata.type = this.formData.type);

    if (this.action === 'Create') {
      this.thingsService.addThing(this.formData).subscribe(
        resp => {
          this.notificationsService.success('Thing successfully created', '');
          this.dialogRef.close(true);
        },
      );
    }
    if (this.action === 'Edit') {
      this.thingsService.editThing(this.formData).subscribe(
        resp => {
          this.notificationsService.success('Thing successfully edited', '');
          this.dialogRef.close(true);
        },
      );
    }
  }
}
