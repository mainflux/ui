export interface GatewayMetadata {
  ctrl_channel_id?: string;
  data_channel_id?: string;
  export_channel_id?: string;
  export_thing_id?: string;
  gw_password?: string;
  mac?: string;
  cfg_id?: string;
  type?: string;
}

export interface Gateway {
  id?: string;
  key?: string;
  name?: string;
  metadata?: GatewayMetadata;
  mac?: string;
}
