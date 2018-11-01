import * as next from 'next';
import Server from './server';
import { Context } from 'koa';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

app.prepare().then(async () => {
  await Server.init({
    middlewares: [
      async (ctx: Context, next) => {
        ctx.next = app;
        await next();
      },
      async (ctx, next) => {
        ctx.res.statusCode = 200;
        await next();
      }
    ]
  });
});
