export interface GatewayMetadata {
  ctrlChannelID?: string;
  dataChannelID?: string;
  exportChannelID?: string;
  exportThingID?: string;
  gwPassword?: string;
  mac?: string;
  cfgID?: string;
  type?: string;
}

export interface Gateway {
  id?: string;
  key?: string;
  name?: string;
  metadata?: GatewayMetadata;
}
