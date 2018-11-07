import * as React from 'react';
import { Form, Input, Row, Col } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import {
  prettyCardNumber,
  isCreditCardValid,
  getAvailableYear,
  getAvailableMonth,
} from '../../../server/utils';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

interface IProps extends FormComponentProps {}

class CreditCardForm extends React.Component<IProps> {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <span>
        <FormItem {...formItemLayout} label="Card Holder">
          {getFieldDecorator('holderName', {
            rules: [
              {
                required: true,
                message: 'Please input credit card holder name',
              },
            ],
          })(<Input placeholder="Please input card holder name" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Credit Card Number" required>
          {getFieldDecorator('number', {
            rules: [
              {
                validator: (rule, value, callback) => {
                  const cardNumber = value.replace(/\s/g, '');
                  if (!isCreditCardValid(cardNumber)) {
                    callback('Please input a valid credit card number');
                  }
                  callback();
                },
              },
            ],
            normalize: (value = '') => {
              const cardNumber = value.replace(/\s/g, '');
              return prettyCardNumber(cardNumber);
            },
          })(<Input placeholder="Please input credit card number" />)}
        </FormItem>
        <Row gutter={8}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="Valid Date" required>
              {getFieldDecorator('exp', {
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      const [ month, year ] = value.split('/');
                      if (!year) {
                        callback('Please input a valid date');
                      }
                      if (getAvailableYear().indexOf(parseInt(year)) === -1) {
                        callback('Please input a valid date');
                      }
                      if (getAvailableMonth().indexOf(parseInt(month)) === -1) {
                        callback('Please input a valid date');
                      }
                      callback();
                    },
                  },
                ],
                normalize: (value = '', prevValue = '') => {
                  const tempValue = value.replace('/', '');
                  if (tempValue.length > 4 || isNaN(parseInt(tempValue || 0))) {
                    return prevValue;
                  }
                  if (prevValue.length >= value.length) {
                    return value;
                  }
                  return tempValue.replace(/(..)/, '$1/');
                },
              })(<Input placeholder="Month/Year" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="CCV" required>
              {getFieldDecorator('CCV', {
                rules: [
                  {
                    required: true,
                    message: 'Please input a valid CCV',
                  },
                ],
                normalize: (value = '', prevValue = '') => {
                  const tempValue = parseInt(value || 0);
                  if (isNaN(tempValue)) {
                    return prevValue;
                  }
                  if (value.length > 4) {
                    return prevValue;
                  }
                  return value;
                },
              })(<Input placeholder="Please input CCV" />)}
            </FormItem>
          </Col>
        </Row>
      </span>
    );
  }
}

export default Form.create()(CreditCardForm);
