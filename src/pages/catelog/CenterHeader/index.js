import React, { Component } from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import './index.less';

class CenterHeader extends Component {
  
  render() {
    const sortMenu = (
      <Menu>
        <Menu.Item key="0">
          <Icon type="laptop" theme="outlined" />按时间
        </Menu.Item>
        <Menu.Item key="1">
          <Icon type="folder-open" theme="outlined" />按标题
        </Menu.Item>
        <Menu.Item key="2">
          <Icon type="tag" theme="outlined" />按标签
        </Menu.Item>
        <Menu.Item key="3">
          <Icon type="camera" theme="outlined" />按优先级
        </Menu.Item>
      </Menu>
    );
    const otherMenu = (
      <Menu>
        <Menu.Item key="0">
          <Icon type="eye" theme="outlined" />隐藏已完成
        </Menu.Item>
        <Menu.Item key="1">
          <Icon type="deployment-unit" theme="outlined" />分享
        </Menu.Item>
      </Menu>
    );
    return (
      <div className="center-header">
        <h5 className="title">智慧教育开发组</h5>
        <div className="tools">
          <Icon type="folder-open" theme="outlined" />
          <Icon type="bar-chart" theme="outlined" />
          <Dropdown overlay={sortMenu} trigger={['click']}>
            <Icon type="clock-circle" theme="outlined" />
          </Dropdown>
          <Dropdown overlay={otherMenu} trigger={['click']}>
            <Icon type="plus-circle" theme="outlined" />
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default CenterHeader