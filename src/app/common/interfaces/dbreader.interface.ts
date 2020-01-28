export interface DbReaderMetadata {
  type?: string;
  db_reader_data: any;
  channelID?: string;
}

export interface DbReaderNode {
  name?: string;
  id?: string;
  key?: string;
  metadata?: DbReaderMetadata;
}

export enum DbType  {
  MICROSOFT_SQL_SERVER = 'mssql',
}

export const DbTypes = [
  {
    name: 'Microsoft SQL Server',
    value: DbType.MICROSOFT_SQL_SERVER,
  },
];
