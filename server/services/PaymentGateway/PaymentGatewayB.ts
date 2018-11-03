import { IPaymentGateway, IPaymentResponse } from '../../interface';
import { PaymentStatus, PaymentGatewayName } from '../../enum';
import { getReferenceNumber } from '../../utils';

class PaymentGatewayB implements IPaymentGateway {
  name: PaymentGatewayName;
  isAvaliable: boolean = false;

  constructor({ appKey, name }) {
    console.log(`Payment Gateway B is authorized, key: ${appKey}`);
    this.isAvaliable = true;
    this.name = name;
  }

  public async pay(): Promise<IPaymentResponse> {
    if (!this.isAvaliable) {
      throw new Error(`Payment gateway ${this.name} is not avaliable`);
    }
    const paymentReference = getReferenceNumber();

    if (Math.floor(Math.random() * 100) % 2 === 0) {
      return {
        status: PaymentStatus.Success,
        msg: 'Success',
        paymentGateway: this.name,
        paymentReference,
        additionData: {}
      };
    } else {
      return {
        status: PaymentStatus.Failed,
        msg: 'Failed',
        paymentGateway: this.name,
        paymentReference,
        additionData: {}
      };
    }
  }
}

export default PaymentGatewayB;
