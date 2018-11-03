import * as mongoose from 'mongoose';
import { getReferenceNumber } from '../utils';
import { PaymentStatus, PaymentGatewayName, Currency } from '../enum';

export interface IPaymentModel extends mongoose.Document {
  reference: string;
  status: PaymentStatus;
  paymentGateway: PaymentGatewayName;
  paymentReference: string;
  customer: {
    name: string;
    phone: string;
  };
  payment: {
    amount: number;
    currency: Currency;
  };
}

const Schema = new mongoose.Schema(
  {
    reference: String,
    status: Number, // 0 1 2
    paymentGateway: String,
    paymentReference: String,
    customer: {
      name: String,
      phone: String
    },
    payment: {
      amount: Number,
      currency: String
    }
  },
  {
    timestamps: {
      updatedAt: true,
      createdAt: true
    },
    versionKey: false,
    collection: 'Payment'
  }
);

const PaymentModel = mongoose.model<IPaymentModel>('Payment', Schema);

interface IPaymentRecordData {
  status: PaymentStatus;
  paymentGateway: PaymentGatewayName;
  paymentReference: string;
  customer: {
    name: string;
    phone: string;
  };
  payment: {
    amount: number;
    currency: string;
  };
}

interface IGetPaymentRecordOptions {
  customer: {
    name: string;
  };
  reference: string;
}

class Payment extends PaymentModel {
  public static createPaymentRecord(data: IPaymentRecordData) {
    const record = new this({
      reference: getReferenceNumber(),
      paymentGateway: data.paymentGateway,
      paymentReference: data.paymentReference,
      customer: data.customer,
      payment: data.payment
    });
    return record.save();
  }

  public static getPaymentRecord(options: IGetPaymentRecordOptions) {
    return this.findOne({
      customer: options.customer,
      reference: options.reference
    });
  }
}

export default Payment;
