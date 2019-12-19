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
}

export interface ConfigUpdate {
  content: string;
  name: string;
}
