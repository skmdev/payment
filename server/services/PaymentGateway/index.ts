import * as creditCardType from 'credit-card-type';
import { PaymentGatewayName, Currency } from '../../enum';
import { IPaymentGateway } from '../../interface';
import PaymentGatewayA from './PaymentGatewayA';
import PaymentGatewayB from './PaymentGatewayB';

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
  private static paymentGateway: { [key: string]: IPaymentGateway } = {};

  public static init() {
    PaymentGatewayManager.paymentGateway[
      PaymentGatewayName.A
    ] = new PaymentGatewayA({
      appKey: 'test-key-a',
      name: PaymentGatewayName.A
    });

    PaymentGatewayManager.paymentGateway[
      PaymentGatewayName.B
    ] = new PaymentGatewayB({
      appKey: 'test-key-b',
      name: PaymentGatewayName.B
    });
  }

  public static getPaymentGateway(data: IData): IPaymentGateway {
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
