/**
 * DB Reader data type
 */

export class MsSQLServerClass {
  server: string;
  instance: string;
  port: number;
  dbuser: string;
  dbpass: string;
  dbtype: string;
  database: string;
  table: string;
  where: string;
  interval: number;
  columns: string;
  constructor() {
    this.server = '';
    this.instance = '';
    this.port = 0;
    this.dbuser = '';
    this.dbpass = '';
    this.dbtype = '';
    this.database = '';
    this.table = '';
    this.where = '';
    this.interval = 0;
    this.columns = '';
  }
}
