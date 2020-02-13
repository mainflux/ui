export interface DbReaderMetadata {
  type?: string;
  db_reader_data: any;
  channel_id?: string;
}

export interface DbReaderNode {
  name?: string;
  id?: string;
  key?: string;
  metadata?: DbReaderMetadata;
}

export enum DbType {
  MICROSOFT_SQL_SERVER = 'mssql',
  CSV = 'csv',
}

export const DbTypes = [
  {
    name: 'Microsoft SQL Server',
    value: DbType.MICROSOFT_SQL_SERVER,
  },
  {
    name: 'CSV',
    value: DbType.CSV,
  },
];
