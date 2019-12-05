export interface OpcuaMetadata {
    type?: string;
    opcua: {
      serverURI?: string,
      nodeID?: string,
    };
    channelID?: string;
}

export interface OpcuaNode {
  name?: string;
  id?: string;
  key?: string;
  metadata?: OpcuaMetadata;
}
