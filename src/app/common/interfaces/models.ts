export interface User {
  email?: string;
  password?: string;
  picture?: string;
  metadata?: Object;
}

export interface Channel {
  id?: string;
  name?: string;
  metadata?: any;
}

export interface Thing {
  id?: string;
  key?: string;
  name?: string;
  metadata?: any;
}

export interface GatewayMetadata {
  ctrlChannelID?: string;
  dataChannelID?: string;
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
export interface SenML {

  
}

export interface Config {
  thing_id: string;
  thing_key: string;
  channels: Array<string>;
  external_id: string;
  external_key: string;
  content: string;
  state: number;
}

export interface ConfigContent {
  log_level: string;
  http_port: string;
  mqtt_url: string;
  edgex_url: string;
  wowza_url: string;
}

export interface ConfigUpdate {
  content: string;
  name: string;
}

export interface Message {
  bn: string;
  bt: number;
  bu: string;
  bver: number;
  n: string;
  t: number;
  u: string;
  v: number;
  vs: string;
}
