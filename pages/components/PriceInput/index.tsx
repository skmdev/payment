import * as React from 'react';
import { Input, Select, InputNumber } from 'antd';
import { Currency } from '../../../server/types/enum';

const Option = Select.Option;

interface IProps {
  size?: 'default' | 'large' | 'small';
  value?: IState;
  onChange?: (data: IState) => void;
}

interface IState {
  amount: number;
  currency: Currency;
}

class PriceInput extends React.Component<IProps, IState> {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...nextProps.value || {}
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      amount: value.amount || 0,
      currency: value.currency || 'RMB'
    };
  }

  handleNumberChange = (amount) => {
    // const isMatch = (e.target.value || '0').match(/(\d+\.\d{0,2}|\d+)/);

    // if (!isMatch) {
    //   return;
    // }
    // const amount = isMatch[1];

    if (!('value' in this.props)) {
      this.setState({ amount });
    }
    this.triggerChange({ amount });
  };

  handleCurrencyChange = (currency) => {
    if (!('value' in this.props)) {
      this.setState({ currency });
    }
    this.triggerChange({ currency });
  };

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const { size } = this.props;
    const state = this.state;
    return (
      <span>
        <InputNumber
          size={size}
          value={state.amount}
          min={0}
          precision={2}
          onChange={this.handleNumberChange}
          style={{ width: '65%', marginRight: '3%' }}
        />
        <Select
          value={state.currency}
          size={size}
          style={{ width: '32%' }}
          onChange={this.handleCurrencyChange}
        >
          {Object.keys(Currency).map((key) => (
            <Option key={key} value={key}>
              {key}
            </Option>
          ))}
        </Select>
      </span>
    );
  }
}

export default PriceInput;
