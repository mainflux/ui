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

export interface Twin {
  name?: string;
  owner?: string;
  id?: string;
  revision?: number;
  created?: Date;
  definitions?: any[];
  definition?: any; // for request
  metadata?: any;
}

export interface Attribute {
  name: string;
  channel: string;
  subtopic?: string;
  persist_state: boolean;
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
