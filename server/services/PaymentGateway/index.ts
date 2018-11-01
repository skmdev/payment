import creditCardType from 'credit-card-type';

import { IPaymentDetail, Currency } from '../../interface';
import PaymentGatewayA from './PaymentGatewayA';
import PaymentGatewayB from './PaymentGatewayB';

const PaymentGatewayMapping = {
  card: {
    [creditCardType.types.AMERICAN_EXPRESS]: [PaymentGatewayA]
  },
  currency: {
    [Currency.USD]: [PaymentGatewayA],
    [Currency.AUD]: [PaymentGatewayA],
    [Currency.EUR]: [PaymentGatewayA],
    [Currency.JPY]: [PaymentGatewayA],
    [Currency.CNY]: [PaymentGatewayA]
  }
};

class PaymentGatewayManager {
  public static getPaymentGateway(
    paymentDetail: IPaymentDetail
  ): IPaymentGateway {
    // Handle for card payment
    if (paymentDetail.paymentData.card) {
      // If the card is AMEX, then use Gateway A
      let PaymentGateways = PaymentGatewayMapping.card[''];

      if (PaymentGateways) {
        return new PaymentGateways[0]();
      }

      PaymentGateways =
        PaymentGatewayMapping.currency[paymentDetail.price.currency];
      // If currency is USD, AUD, EUR, JPY, CNY, then use Gateway A. Otherwise use Gateway B
      if (PaymentGateways) {
        return new PaymentGateways[0]();
      } else {
        return new PaymentGatewayB();
      }
    }
    // Handling for unhandled case
    throw new Error('Please select a avaliable payment method');
  }
}

export enum IPaymentStatus {
  Failed = -1,
  Pending,
  Success
}

export interface IPaymentResponse {
  referenceNumber: string;
  status: IPaymentStatus;
  msg: string;
  additionData?: any;
}

export interface IPaymentGateway {
  pay(paymentDetail: IPaymentDetail): IPaymentResponse;
}

export default PaymentGatewayManager;
