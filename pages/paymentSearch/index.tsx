import React from 'react';
import Link from 'next/link';

import { Form, Row, Col, Input, Button, Divider, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import { searchPayment } from '../services/payment';

import './index.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IState {
  isSearching: boolean;
  paymentRecord?: {
    customer: {
      name: string;
      phone: string;
    };
    payment: {
      amount: number;
      currency: string;
    };
  };
}

interface IProps extends FormComponentProps {}

class PaymentSearchPage extends React.Component<IProps, IState> {
  public state = {
    paymentRecord: undefined,
    isSearching: false
  };
  private handleSearch = async (e) => {
    e.preventDefault();
    this.setState(
      {
        isSearching: true
      },
      () => {
        this.props.form.validateFields(async (err, values) => {
          if (err) {
            this.setState({
              isSearching: false
            });
            return;
          }
          console.log('Received values of form: ', values);
          let paymentRecord = undefined;
          try {
            const response = await searchPayment({
              reference: values.reference,
              customerName: values.customerName
            });
            paymentRecord = response.data.data;
          } catch (e) {
            Modal.error({
              title: 'Not Found'
            });
          } finally {
            this.setState({
              paymentRecord,
              isSearching: false
            });
          }
        });
      }
    );
  };

  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
          <Row gutter={24}>
            <Col span={12}>
              <FormItem {...formItemLayout} label="Reference Number">
                {getFieldDecorator('reference', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input reference number!'
                    }
                  ]
                })(<Input placeholder="Reference Number" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="Customer Name">
                {getFieldDecorator('customerName', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input customer name!'
                    }
                  ]
                })(<Input placeholder="Customer name" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Button
                style={{ width: '100%' }}
                type="primary"
                htmlType="submit"
                loading={this.state.isSearching}
              >
                Search
              </Button>
            </Col>
            <Col span={24} style={{ marginTop: '10px' }}>
              <Link href="/">
                <Button style={{ width: '100%' }}>Back to home page</Button>
              </Link>
            </Col>
          </Row>
        </Form>
        {this.state.paymentRecord && (
          <div className="payment-record-container">
            <h3>Reference: {this.props.form.getFieldValue('reference')}</h3>
            <p>Customer Name: {this.state.paymentRecord.customer.name}</p>
            <p>Customer Phone: {this.state.paymentRecord.customer.phone}</p>
            <Divider />
            <p>Payment amount: {this.state.paymentRecord.payment.amount}</p>
            <p>Payment currency: {this.state.paymentRecord.payment.currency}</p>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Form.create()(PaymentSearchPage);
