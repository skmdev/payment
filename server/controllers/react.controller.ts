import { Controller, Route } from 'koa-decorator-ts';
import { Context } from 'koa';

@Controller('/')
class ReactController {
  @Route.get('/payment')
  static async Paymentpage(ctx: Context) {
    console.log(ctx.next);
    await ctx.next.render(ctx.req, ctx.res, '/a', ctx.query);
    ctx.respond = false;
  }

  @Route.get('/payment/search')
  static async PaymentSearchPage(ctx: Context) {
    await ctx.next.render(ctx.req, ctx.res, '/b', ctx.query);
    ctx.respond = false;
  }

  @Route.get('*')
  static async HandlePage(ctx: Context) {
    const handle = ctx.next.getRequestHandler();
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  }
}

export default ReactController;
