/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  usersUrl: '/users',
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

  writerChannelsUrl: '/writer/channels',
  readerChannelsUrl: '/reader/channels',

  grafanaHome: 'http://localhost:3001/?orgId=1&kiosk',
  jaegerHome: 'http://localhost:16686/search',
  loraServer: 'http://lora.mainflux.io/#/',

  mqttWsUrl: 'ws://localhost:80/mqtt',
  exportConfigFile: 'export.toml',
};
