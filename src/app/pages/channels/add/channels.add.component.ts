import { Component, Input, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

import { ChannelsService } from 'app/common/services/channels/channels.service';
import { NotificationsService } from 'app/common/services/notifications/notifications.service';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'ngx-channels-add-component',
  templateUrl: './channels.add.component.html',
  styleUrls: ['./channels.add.component.scss'],
})
export class ChannelsAddComponent {
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
    protected dialogRef: NbDialogRef<ChannelsAddComponent>,
    private channelsService: ChannelsService,
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
      this.channelsService.addChannel(this.formData).subscribe(
        resp => {
          this.notificationsService.success('Channel successfully created', '');
          this.dialogRef.close(true);
        },
      );
    }
    if (this.action === 'Edit') {
      this.channelsService.editChannel(this.formData).subscribe(
        resp => {
          this.notificationsService.success('Channel successfully edited', '');
          this.dialogRef.close(true);
        },
      );
    }
  }
}
