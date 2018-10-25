import React, { Component } from 'react';
import { Checkbox, Icon } from 'antd';
import './index.less';

class DetailHeader extends Component {

  onChange = () => {

  }

  render() {
    return (
      <div className="detail-header">
        <Checkbox onChange={this.onChange}></Checkbox>
        <Icon type="schedule" theme="outlined" />
        <span>{this.props.deadline}</span>
      </div>
    );
  }
}

export default DetailHeader