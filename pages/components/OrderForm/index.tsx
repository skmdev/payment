import * as React from 'react';
import { Form, Input, Divider } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Currency } from '../../../server/types/enum';
import PriceInput from '../PriceInput';

const FormItem = Form.Item;
// const Option = Select.Option;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

interface IProps extends FormComponentProps {}

class OrderForm extends React.Component<IProps> {
  handleNumberChange = (value, prevValue = '') => {
    const isNumber = /^[0-9]*$/.test(value);
    if (!isNumber) {
      return prevValue;
    }
    return value;
  };

  checkPrice = (rule, value, callback) => {
    if (value.amount > 0) {
      callback();
      return;
    }
    callback('Price must greater than zero!');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <span>
        <FormItem {...formItemLayout} label="Name">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'Please input your name'
              }
            ]
          })(<Input placeholder="Please input your name" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Phone number">
          {getFieldDecorator('phone', {
            rules: [
              {
                required: true,
                message: 'Please input your phone number'
              }
            ],
            normalize: this.handleNumberChange
          })(<Input placeholder="Please input your phone number" />)}
        </FormItem>
        <Divider />
        <FormItem {...formItemLayout} label="Price">
          {getFieldDecorator('price', {
            initialValue: { amount: 0, currency: Currency.USD },
            rules: [
              { validator: this.checkPrice },
              {
                required: true,
                message: 'Please input a valid amount'
              }
            ]
          })(<PriceInput />)}
        </FormItem>
      </span>
    );
  }
}

export default Form.create()(OrderForm);
