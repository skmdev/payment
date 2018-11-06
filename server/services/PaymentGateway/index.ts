import * as creditCardType from 'credit-card-type';
import { PaymentGatewayName, Currency } from '../../types/enum';
import { IPaymentGateway, IPaymentDetail } from '../../types/interface';
import PaymentGatewayA from './PaymentGatewayA';
import PaymentGatewayB from './PaymentGatewayB';
import Logger from '../Logger';
import Config from '../../config';

interface IData {
  payment: {
    amount: number;
    currency: Currency;
  };
  settlement: {
    card?: {
      number;
    };
  };
}

class PaymentGatewayManager {
  private static logger = Logger.getLogger('Payment Gateway');
  private static paymentGateway: { [key: string]: IPaymentGateway } = {
    [PaymentGatewayName.A]: new PaymentGatewayA({
      name: PaymentGatewayName.A,
      ...Config.paypal
    }),
    [PaymentGatewayName.B]: new PaymentGatewayB({
      name: PaymentGatewayName.B,
      ...Config.braintree
    })
  };

  public static async init() {
    for (const key of Object.keys(this.paymentGateway)) {
      const paymentGateway = await this.paymentGateway[key].init();
      if (paymentGateway.isAvaliable) {
        this.logger.info(`Payment Gateway ${paymentGateway.name} is avaliable`);
      } else {
        this.logger.error(
          `Payment Gateway ${paymentGateway.name} is not avaliable`
        );
      }
    }
  }

  public static pay(data: IPaymentDetail) {
    const paymentGateway = this.getPaymentGateway(data);
    return paymentGateway.pay(data);
  }

  private static getPaymentGateway(data: IData): IPaymentGateway {
    // Handle for card payment
    if (data.settlement.card) {
      const creditCardData = creditCardType(data.settlement.card.number);

      // If the card is AMEX, then use Gateway A
      if (
        creditCardData.length > 0 &&
        creditCardType.types.AMERICAN_EXPRESS === creditCardData[0].type
      ) {
        return PaymentGatewayManager.paymentGateway[PaymentGatewayName.A];
      }

      // If currency is USD, AUD, EUR, JPY, CNY, then use Gateway A. Otherwise use Gateway B
      if (
        [
          Currency.USD,
          Currency.AUD,
          Currency.EUR,
          Currency.JPY,
          Currency.CNY
        ].indexOf(data.payment.currency) > -1
      ) {
        return PaymentGatewayManager.paymentGateway[PaymentGatewayName.A];
      } else {
        return PaymentGatewayManager.paymentGateway[PaymentGatewayName.B];
      }
    }
    // Handling for unhandled case
    throw new Error('No payment gateway is avaliable!');
  }
}

export default PaymentGatewayManager;
