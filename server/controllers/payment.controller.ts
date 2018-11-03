import { Context } from 'koa';
import { Controller, Route, Required } from 'koa-decorator-ts';
import { IPaymentDetail } from '../interface';
import { PaymentStatus } from '../enum';
import PaymentGatewayManager from '../services/PaymentGateway';
import PaymentModel from '../models/payment.model';

@Controller('/api/payment')
class PaymentController {
  @Route.post('/')
  @Required({
    body: {
      type: 'object',
      properties: {
        customer: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            phone: {
              type: 'string'
            }
          },
          required: ['name', 'phone']
        },
        payment: {
          type: 'object',
          properties: {
            amount: {
              type: 'number'
            },
            currency: {
              type: 'string'
            }
          },
          required: ['amount', 'currency']
        },
        settlement: {
          type: 'object',
          properties: {
            card: {
              type: 'object',
              properties: {
                holderName: {
                  type: 'string'
                },
                number: {
                  type: 'string'
                },
                exp: {
                  type: 'string'
                },
                CCV: {
                  type: 'string'
                }
              },
              required: ['holderName', 'number', 'exp', 'CCV']
            }
          },
          required: ['card']
        }
      },
      required: ['customer', 'payment', 'settlement']
    }
  })
  public static async submitPayment(ctx: Context) {
    const data = ctx.request.body as IPaymentDetail;
    const { settlement, payment } = data;

    // Get avaliable payment gateway
    const paymentGateway = PaymentGatewayManager.getPaymentGateway({
      payment,
      settlement
    });

    // Pay by payment gateway
    const paymentResponse = await paymentGateway.pay(data);

    // Store payment result in db
    const paymentRecord = await PaymentModel.createPaymentRecord({
      status: paymentResponse.status,
      customer: data.customer,
      paymentGateway: paymentResponse.paymentGateway,
      paymentReference: paymentResponse.paymentReference,
      payment
    });

    // Store payment result in redis

    // Set status
    if (paymentResponse.status === PaymentStatus.Failed) {
      ctx.status = 400;
    }

    ctx.body = {
      data: {
        reference: paymentRecord.reference
      }
    };
    // Todo
  }

  @Route.get('/:reference')
  @Required({
    params: {
      type: 'object',
      properties: {
        reference: {
          type: 'string'
        }
      },
      required: ['reference']
    },
    query: {
      type: 'object',
      properties: {
        customerName: {
          type: 'string'
        }
      },
      required: ['customerName']
    }
  })
  public static async searchPaymentRecord(ctx: Context) {
    const { reference } = ctx.params;
    const { customerName } = ctx.request.query;

    const paymentRecord = await PaymentModel.getPaymentRecord({
      customer: { name: customerName },
      reference
    });

    if (!paymentRecord) {
      ctx.status = 404;
    }

    ctx.body = {
      data: {
        customer: {
          name: paymentRecord.customer.name,
          phone: paymentRecord.customer.phone
        },
        payment: {
          amount: paymentRecord.payment.amount,
          currency: paymentRecord.payment.currency
        }
      }
    };
  }
}

export default PaymentController;
