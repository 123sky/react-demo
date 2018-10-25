import React, { Component } from 'react';
import './index.less';

class CenterArea extends Component {
  render() {
    return (
      <div className="center-area">
        {this.props.children}
      </div>
    );
  }
}

export default CenterArea