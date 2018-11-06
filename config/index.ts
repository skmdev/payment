export interface IConfig {
  port: number;
  db: {
    url: string;
    reconnectTries?: number;
    reconnectInterval?: number;
  };
  redis: {
    host: string;
    port: number;
    expireTime?: number;
  };
  paypal: {
    key: string;
  };
  braintree: {
    key: string;
  };
}

let config: IConfig;

switch (process.env.NODE_ENV) {
  case 'development':
    config = require('./config.dev.json');
    break;
  case 'production':
    config = require('./config.prod.json');
    break;
  default:
    config = require('./config.dev.json');
    break;
}

export default config;
