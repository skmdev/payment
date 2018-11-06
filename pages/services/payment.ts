import axios from 'axios';
import { IPaymentDetail } from '../../server/types/interface';

export async function submitPayment(data: IPaymentDetail) {
  return axios.post('/api/payment', data);
}
