export const environment = {
  usersUrl: '/users',
  groupsUrl: '/groups',
  membersUrl: '/members',
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
  disconnectUrl: '/disconnect',
  browseUrl: '/browse',

  httpAdapterUrl: '/http',
  readerUrl: '/reader',
  readerPrefix: 'channels',
  readerSuffix: 'messages',

  mqttWsUrl: window['env']['mqttWsUrl'] || 'ws://localhost/mqtt',
  proxyAuth: window['env']['proxyAuth'] || false,
  exportConfigFile: '/configs/export/config.toml',
};
