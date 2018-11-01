import Koa, { Context } from 'koa';
import PaymentGateway from '../services/PaymentGateway';
import { IPaymentDetail } from '../interface';
import { Controller, Route } from 'koa-decorator-ts';

interface IPaymentSearchBody {
  customer: {
    name: string;
  };
  payment: {
    reference: string;
  };
}

@Controller('/api/payment')
class PaymentController {
  @Route.post('/')
  public static async submitPayment(ctx: Context) {
    const a: IPaymentDetail = ctx.request.query;
    console.log('ssffa');

    if (!a.customer) {
      throw new Error('No customer information');
    }

    if (!a.paymentData) {
      throw new Error('No payment data');
    }

    if (!a.price) {
      throw new Error('No price');
    }

    const paymentGateway = PaymentGateway.getPaymentGateway(a);
    const paymentResponse = await paymentGateway.pay(a);
    // Store to db
    ctx.body = paymentResponse;
    // Todo
  }

  @Route.post('/search')
  public static searchPaymentRecord(ctx: Koa.Context) {
    const a: IPaymentSearchBody = ctx.request.query;
    ctx.body = a;
    // Todo:
    // Get data from redis
    // if no get data from db
    // return null
  }
}

export default PaymentController;
