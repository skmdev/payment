import { IPaymentGateway, IPaymentStatus, IPaymentResponse } from './';

class PaymentGatewayB implements IPaymentGateway {
  public pay(): IPaymentResponse {
    if (Math.floor(Math.random() * 100) % 2 === 0) {
      return {
        status: IPaymentStatus.Success,
        msg: 'Success',
        referenceNumber: '2'
      };
    } else {
      return {
        status: IPaymentStatus.Failed,
        msg: 'Failed',
        referenceNumber: '1'
      };
    }
  }
}

export default PaymentGatewayB;
