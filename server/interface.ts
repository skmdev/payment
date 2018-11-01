export enum Currency {
  HKD = 'HKD',
  USD = 'USD',
  AUD = 'AUD',
  EUR = 'EUR',
  JPY = 'JPY',
  CNY = 'CNY',
}

export interface IPaymentDetail {
  customer: {
    name: string;
    phone: string;
    [key: string]: any; // for extends use
  };
  price: {
    amount: number;
    currency: Currency;
    [key: string]: any; // for extends use
  };
  paymentData: {
    card?: {
      name: string;
      number: string;
      exp: string;
      CCV: string;
    };
    [key: string]: any; // for extends use
  };
}
