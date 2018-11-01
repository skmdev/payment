import React from 'react';

interface IState {
  counter: number;
}

export default class B extends React.Component<any, IState> {
  public state = {
    counter: 0
  };
  add = () => {
    this.setState({
      counter: this.state.counter + 1
    });
  };
  minus = () => {
    this.setState({
      counter: this.state.counter - 1
    });
  };
  public render() {
    return (
      <div>
        <button onClick={this.add}>+</button>
        {this.state.counter}
        <button onClick={this.minus}>-</button>
      </div>
    );
  }
}
