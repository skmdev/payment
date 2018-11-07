import { Context } from 'koa';
import { Controller, Route, Required } from 'koa-decorator-ts';
import { IPaymentDetail } from '../types/interface';
import { PaymentStatus, Currency } from '../types/enum';
import { isCreditCardValid, getAvailableYear, getAvailableMonth } from '../utils';
import PaymentGateway from '../services/PaymentGateway';
import Payment from '../services/Payment';

@Controller('/api/payment')
class PaymentController {
  @Required({
    body: {
      type: 'object',
      properties: {
        customer: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            phone: {
              type: 'string',
            },
          },
          required: [ 'name', 'phone' ],
        },
        payment: {
          type: 'object',
          properties: {
            amount: {
              type: 'number',
            },
            currency: {
              type: 'string',
            },
          },
          required: [ 'amount', 'currency' ],
        },
        settlement: {
          type: 'object',
          properties: {
            card: {
              type: 'object',
              properties: {
                holderName: {
                  type: 'string',
                },
                number: {
                  type: 'string',
                },
                exp: {
                  type: 'object',
                  properties: {
                    month: {
                      type: 'string',
                    },
                    year: {
                      type: 'string',
                    },
                  },
                },
                CCV: {
                  type: 'string',
                },
              },
              required: [ 'holderName', 'number', 'exp', 'CCV' ],
            },
          },
          required: [ 'card' ],
        },
      },
      required: [ 'customer', 'payment', 'settlement' ],
    },
  })
  @Route.post('/')
  public static async submitPayment(ctx: Context) {
    const data = ctx.request.body as IPaymentDetail;

    if (!Currency[data.payment.currency]) {
      ctx.throw(400, `Not support for currency: ${data.payment.currency}`);
    }

    if (data.settlement.card) {
      if (!isCreditCardValid(data.settlement.card.number)) {
        ctx.throw(400, `Credit card number is not valid`);
      }

      if (
        getAvailableYear().indexOf(parseInt(data.settlement.card.exp.year)) === -1 ||
        getAvailableMonth().indexOf(parseInt(data.settlement.card.exp.month)) === -1
      ) {
        ctx.throw(400, `Credit card exp is not valid`);
      }
    }

    // Pay by payment gateway
    const paymentResponse = await PaymentGateway.pay(data);

    // Store payment result in db
    const paymentRecord = await Payment.storePaymentRecord({
      status: paymentResponse.status,
      customer: data.customer,
      payment: data.payment,
      paymentGateway: paymentResponse.paymentGateway,
      paymentReference: paymentResponse.paymentReference,
      paymentGatewayResponse: paymentResponse.paymentGatewayResponse,
    });

    // Store payment result in redis

    // Set status
    if (paymentResponse.status !== PaymentStatus.Success) {
      ctx.status = 400;
    }

    ctx.body = {
      message: paymentResponse.msg,
      data: {
        reference: paymentRecord.reference,
      },
    };
    // Todo
  }

  @Required({
    params: {
      type: 'object',
      properties: {
        reference: {
          type: 'string',
        },
      },
      required: [ 'reference' ],
    },
    query: {
      type: 'object',
      properties: {
        customerName: {
          type: 'string',
        },
      },
      required: [ 'customerName' ],
    },
  })
  @Route.get('/:reference')
  public static async searchPaymentRecord(ctx: Context) {
    const { reference } = ctx.params;
    const { customerName } = ctx.request.query;

    const paymentRecord = await Payment.getPaymentRecord(reference);

    if (!paymentRecord) {
      ctx.throw(404, 'Payment record not found');
    }

    if (paymentRecord.customer.name !== customerName) {
      ctx.throw(404, 'Payment record not found');
    }

    ctx.body = {
      data: {
        customer: {
          name: paymentRecord.customer.name,
          phone: paymentRecord.customer.phone,
        },
        payment: {
          amount: paymentRecord.payment.amount,
          currency: paymentRecord.payment.currency,
        },
      },
    };
  }
}

export default PaymentController;
