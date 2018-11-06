import React from 'react';
import { Button, Steps, message } from 'antd';
import OrderForm from '../components/OrderForm';
import { Currency } from '../../server/types/enum';

import './index.less';
import CreditCardForm from '../components/CreditCardForm';
import { string, number } from 'prop-types';

const Step = Steps.Step;

interface IState {
  current: number;
  customer: {
    name: string;
    phone: string;
  };
  payment: {
    currency: Currency;
    amount: number;
  };
  settlement: {
    card: {
      holderName: string;
      number: string;
      exp: {
        month: string;
        year: string;
      };
      CCV: string;
    };
  };
}

class PaymentPage extends React.Component<any, IState> {
  state = {
    current: 0,
    customer: {
      name: '',
      phone: ''
    },
    payment: {
      currency: Currency.USD,
      amount: 0
    },
    settlement: {
      card: {
        holderName: '',
        number: '',
        exp: {
          month: '',
          year: ''
        },
        CCV: ''
      }
    }
  };

  orderForm = React.createRef<any>();
  creditCardForm = React.createRef<any>();

  next() {
    let data = {};
    switch (this.state.current) {
      case 0:
        if (!this.orderForm.current) {
          return;
        }
        const orderform = this.orderForm.current.props.form;
        orderform.validateFields((err, values) => {
          if (err) {
            return;
          }
          const current = this.state.current + 1;
          data = {
            current,
            customer: { name: values.name, phone: values.phone },
            payment: {
              currency: values.price.currency,
              amount: values.price.amount
            }
          };
          console.log(data);
        });
        break;
      case 1:
        if (!this.creditCardForm.current) {
          return;
        }
        const creditCardForm = this.creditCardForm.current.props.form;
        creditCardForm.validateFields((err, values) => {
          if (err) {
            return;
          }
          console.log(values);
          const current = this.state.current + 1;
          data = {
            current,
            settlement: {
              card: {
                holderName: '',
                number: '',
                exp: {
                  month: '',
                  year: ''
                },
                CCV: ''
              }
            }
          };
        });
    }
    this.setState(data as Pick<IState, keyof IState>);
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render() {
    const { current } = this.state;

    const steps = [
      {
        title: 'Order',
        // content: <CreditCardForm wrappedComponentRef={this.creditCardForm} />
        content: <OrderForm wrappedComponentRef={this.orderForm} />
      },
      {
        title: 'Payment',
        content: <CreditCardForm wrappedComponentRef={this.creditCardForm} />
      },
      {
        title: 'Result',
        Content: 'Last-content'
      }
    ];
    return (
      <div className="payment-step-container">
        <Steps current={current}>
          {steps.map((item) => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action">
          {current < steps.length - 1 && (
            <Button
              style={{ width: '100%' }}
              type="primary"
              onClick={() => this.next()}
            >
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              style={{ width: '100%' }}
              type="primary"
              onClick={() => message.success('Processing complete!')}
            >
              Done
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{ marginTop: '8px', width: '100%' }}
              onClick={() => this.prev()}
            >
              Previous
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default PaymentPage;
