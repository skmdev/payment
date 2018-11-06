import * as next from 'next';
import Server from './server';
import PaymentGatewayManager from './services/PaymentGateway';
import Database from './services/Database';
import Config from './config';
import Redis from './services/Redis';
import Logger from './services/Logger';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const logger = Logger.getLogger('PaymentApp');

app.prepare().then(async () => {
  PaymentGatewayManager.init();
  await Redis.init();
  await Database.connect(Config.db);
  await Server.init({
    port: Config.port,
    middlewares: [
      async (ctx, next) => {
        ctx.logger = logger;
        await next();
      },
      async (ctx, next) => {
        ctx.next = app;
        await next();
      },
      async (ctx, next) => {
        try {
          await next();
        } catch (e) {
          ctx.status = e.status || 500;
          ctx.body = {
            message: e.message
          };
        }
      },
      async (ctx, next) => {
        ctx.res.statusCode = 200;
        await next();
      }
    ]
  });

  logger.info(`Ready on http://localhost:${Config.port}`);
});
