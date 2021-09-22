import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NotificationsService } from 'app/common/services/notifications/notifications.service';

@Injectable()
export class FsService {

  constructor(
    private notificationsService: NotificationsService,
  ) { }

  exportToJson(filename: string, rows: any) {
    if (!rows || !rows.length) {
      return;
    }
    const jsonContent =
      rows.map(row => {
        let rowJson = '';
          try {
            rowJson = JSON.stringify(row);
          } catch (e) {
            this.notificationsService.warn('Failed to convert to JSON', '');
          }
        return rowJson;
      }).join('\n');

    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // UTF-8 BOM
    const blob = new Blob([bom, jsonContent], { type: 'text/json;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
}
