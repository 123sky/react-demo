import React, { Component } from 'react';
import NavLeft from './NavLeft';
import './index.less';

class Main extends Component {
  render() {
    return (
      <div className="main">
        <div className="left">
          <NavLeft></NavLeft>
        </div>
        <div className="center">
          {this.props.centerArea}
        </div>
        <div className="right">
          {this.props.rightArea}
        </div>
      </div>
    );
  }
}

export default Main;
