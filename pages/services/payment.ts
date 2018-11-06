import axios from 'axios';
import { IPaymentDetail } from '../../server/types/interface';

export async function submitPayment(data: IPaymentDetail) {
  return axios.post('/api/payment', data);
}

interface IPaymentSearchData {
  reference: string;
  customerName: string;
}

export async function searchPayment(data: IPaymentSearchData) {
  return axios.get(
    `/api/payment/${data.reference}?customerName=${data.customerName}`
  );
}
