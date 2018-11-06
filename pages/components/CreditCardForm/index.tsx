import * as React from 'react';
import { Form, Input, Row, Col } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { prettyCardNumber, isCreditCardValid } from '../../../server/utils';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
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
                message: 'Please input credit card holder name'
              }
            ]
          })(<Input placeholder="Please input card holder name" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Credit Card Number">
          {getFieldDecorator('number', {
            rules: [
              {
                required: true
              },
              {
                validator: (rule, value, callback) => {
                  const cardNumber = value.replace(/\s/g, '');
                  if (!isCreditCardValid(cardNumber)) {
                    callback('Please input a valid credit card number');
                  }
                  callback();
                }
              }
            ],
            normalize: (value = '') => {
              const cardNumber = value.replace(/\s/g, '');
              return prettyCardNumber(cardNumber);
            }
          })(<Input placeholder="Please input credit card number" />)}
        </FormItem>
        <Row gutter={8}>
          <Col span={12}>
            <FormItem {...formItemLayout} label="Valid Date">
              {getFieldDecorator('exp', {
                rules: [
                  {
                    required: true,
                    message: 'Please input a valid date'
                  }
                ]
              })(<Input placeholder="Month/Year" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="CCV">
              {getFieldDecorator('CCV', {
                rules: [
                  {
                    required: true,
                    message: 'Please input a valid CCV'
                  }
                ],
                normalize: (value, prevValue = '') => {
                  const formattedValue = `${parseInt(value || 0) || ''}`;
                  if (formattedValue.length > 4) {
                    return prevValue;
                  }
                  return formattedValue;
                }
              })(<Input placeholder="Please input CCV" />)}
            </FormItem>
          </Col>
        </Row>
      </span>
    );
  }
}

export default Form.create()(CreditCardForm);
