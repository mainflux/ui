export interface LoraMetadata {
    type: string;
    lora: {
      dev_eui?: string,
      app_id?: string,
    };
    channel_id: string;
}

export interface LoraDevice {
  name?: string;
  id?: string;
  key?: string;
  metadata?: LoraMetadata;
}

export interface LoraTableRow {
  name: string;
  id: string;
  devEUI: string;
  appID: string;
  metadata: LoraMetadata;
}
