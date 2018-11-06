import React from 'react';
import { Button, Steps, message, Icon } from 'antd';

import { Currency } from '../../server/types/enum';

import OrderForm from '../components/OrderForm';
import CreditCardForm from '../components/CreditCardForm';

import './index.less';

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
  isSubmittingPayment: boolean;
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
    },
    isSubmittingPayment: false
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
          const current = this.state.current + 1;
          const [month, year] = values.exp.split('/');
          data = {
            current,
            settlement: {
              card: {
                holderName: values.holderName,
                number: values.number,
                exp: {
                  month,
                  year
                },
                CCV: values.CCV
              }
            },
            isSubmittingPayment: true
          };
        });
    }
    this.setState(data as Pick<IState, keyof IState>, () => {
      console.log(this.state);
      if (this.state.current === 2) {
      }
    });
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
        title: 'Submit',
        Content: 'Last-content',
        icon: this.state.isSubmittingPayment && <Icon type="loading" />
      }
    ];
    return (
      <div className="payment-step-container">
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} icon={item.icon} />
          ))}
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
