import Redis from './Redis';
import PaymentModel, { IPaymentRecordData } from '../models/payment.model';

class Payment {
  static async getPaymentRecord(reference: string) {
    let paymentRecord;

    paymentRecord = await Redis.getAsync(reference);
    // If redis got data then parse the data to json
    if (paymentRecord) {
      paymentRecord = JSON.parse(paymentRecord);
    }

    // If redis no data then check from db
    if (!paymentRecord) {
      paymentRecord = await PaymentModel.getPaymentRecord(reference);
      // If database got data then store it in redis
      if (paymentRecord) {
        Redis.set(paymentRecord.reference, JSON.stringify(paymentRecord));
      }
    }

    return paymentRecord;
  }

  static async storePaymentRecord(data: IPaymentRecordData) {
    // store payment record to db and redis
    const paymentRecord = await PaymentModel.createPaymentRecord(data);
    Redis.set(paymentRecord.reference, JSON.stringify(paymentRecord));
    return paymentRecord;
  }
}

export default Payment;
