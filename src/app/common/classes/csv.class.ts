/**
 * CSV Reader data type
 */

export class CSVClass {
  interval: number;
  columns: string;
  filename: string;
  constructor() {
    this.interval = 0;
    this.columns = '';
    this.filename = '';
  }
}
