export interface LoraMetadata {
    type: string;
    lora: {
      devEUI?: string,
      appID?: string,
    };
    channelID: string;
}

export interface LoraDevice {
  name?: string;
  id?: string;
  key?: string;
  metadata?: LoraMetadata;
  devEUI?: string;
  appID?: string;
}
