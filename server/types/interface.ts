import { PaymentStatus, PaymentGatewayName, Currency } from './enum';

export interface IPaymentDetail {
  customer: {
    name: string;
    phone: string;
    [key: string]: any; // for extends use
  };
  payment: {
    amount: number;
    currency: Currency;
    [key: string]: any; // for extends use
  };
  settlement: {
    card?: {
      holderName: string;
      number: string;
      exp: {
        month: string;
        year: string;
      };
      CCV: string;
    };
    [key: string]: any; // for extends use
  };
}

export interface IPaymentResponse {
  status: PaymentStatus;
  paymentGateway: PaymentGatewayName;
  paymentReference: string;
  msg: string;
  additionData?: any;
}

export interface IPaymentGateway {
  name: PaymentGatewayName;
  isAvaliable: boolean;
  init(): Promise<this>;
  pay(paymentDetail: IPaymentDetail): Promise<IPaymentResponse>;
}
