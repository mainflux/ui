import { environment as defaultEnvironment } from './environment.defaults';

export const environment = {
  experimental: false,
  production: true,

  usersUrl: '/users',
  groupsUrl: '/groups',
  usersVersionUrl: '/version',
  loginUrl: '/tokens',
  requestPassUrl: '/password/reset-request',
  resetPassUrl: '/password/reset',
  changePassUrl: '/password',
  thingsUrl: '/things',
  twinsUrl: '/twins',
  statesUrl: '/states',
  channelsUrl: '/channels',
  bootstrapConfigsUrl: '/bootstrap/things/configs',
  bootstrapUrl: '/bootstrap/things/bootstrap',
  connectUrl: '/connect',
  browseUrl: '/browse',

  writerChannelsUrl: '/writer/ch',
  readerChannelsUrl: '/reader/ch',

  mqttWsUrl: window['env']['mqttWsUrl'] || 'ws://localhost/mqtt',
  exportConfigFile: '/configs/export/config.toml',
};
