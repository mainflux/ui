export interface CertReq {
  thing_id?: string;
  key_bits?: number;
  key_type?: string;
  ttl?: string;
}

export interface CertRes {
  thing_id?: string;
  client_cert?: string;
  client_key?: string;
  cert_serial?: string;
  expiration?: string;
}
