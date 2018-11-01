import * as Koa from 'koa';

import Router from 'koa-decorator-ts/router';

const port = 3000;

interface IOptions {
  middlewares?: Koa.Middleware[];
}

class Server {
  static async init(options: IOptions = {}) {
    const server = new Koa();
    const router = new Router({
      app: server,
      apiDirPath: `${__dirname}/controllers`
    });

    const middlewares = options.middlewares || [];

    for (const middleware of middlewares) {
      server.use(middleware);
    }

    server.use(router.routes());

    await server.listen(port);

    console.log(`> Ready on http://localhost:${port}`);

    return server;
  }
}

export default Server;
