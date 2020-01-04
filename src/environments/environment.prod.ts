/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  production: true,
  usersUrl: '/users',
  usersVersionUrl: '/version',
  loginUrl: '/tokens',
  requestPassUrl: '/password/reset-request',
  resetPassUrl: '/password/reset',
  changePassUrl: '/password',
  thingsUrl: '/things',
  channelsUrl: '/channels',
  configUrl: '/config',
  bootstrapUrl: '/bootstrap',
  connectUrl: '/connect',
  browseUrl: '/browse',

  writerChannelsUrl: '/writer/channels',
  readerChannelsUrl: '/reader/channels',

  grafanaHome: 'http://localhost:3001/?orgId=1&kiosk',
  jaegerHome: 'http://localhost:16686/search',
  loraServer: 'http://lora.mainflux.io/#/',
  nodeRedHome: 'http://localhost:1880',
};
