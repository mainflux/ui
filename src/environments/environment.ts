import { environment as defaultEnvironment } from './environment.defaults';

export const environment = {
  experimental: false,
  production: false,

    ...defaultEnvironment,
};
