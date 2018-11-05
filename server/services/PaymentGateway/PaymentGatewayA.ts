import { IPaymentGateway, IPaymentResponse } from '../../types/interface';
import { PaymentStatus, PaymentGatewayName } from '../../types/enum';
import { getReferenceNumber } from '../../utils';

class PaymentGatewayA implements IPaymentGateway {
  key: string;
  name: PaymentGatewayName;
  isAvaliable: boolean = false;

  constructor({ name, key }) {
    this.key = key;
    this.name = name;
  }

  public async init() {
    this.isAvaliable = true;
    return this;
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
