import { IPaymentGateway, IPaymentResponse } from '../../interface';
import { PaymentStatus, PaymentGatewayName } from '../../enum';
import { getReferenceNumber } from '../../utils';

class PaymentGatewayA implements IPaymentGateway {
  name: PaymentGatewayName;
  isAvaliable: boolean = false;

  constructor({ name, appKey }) {
    console.log(`Payment Gateway A is authorized, key: ${appKey}`);
    this.name = name;
    this.isAvaliable = true;
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
        additionData: {
          //
        }
      };
    } else {
      return {
        status: PaymentStatus.Failed,
        msg: 'Failed',
        paymentGateway: this.name,
        paymentReference
      };
    }
  }
}

export default PaymentGatewayA;
