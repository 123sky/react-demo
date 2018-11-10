import React, { Component } from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import {withRouter } from 'react-router';
import eventProxy from '../../utils/eventProxy'
import './index.less';

class CenterHeader extends Component {

  showFile = () => {
    this.props.history.push(`/project/${this.props.match.params.projectId}/board/${this.props.match.params.boardId}/file`)
  }

  showStatistics = () => {
    this.props.history.push(`/project/${this.props.match.params.projectId}/board/${this.props.match.params.boardId}/statistics`)
  }

  showLeft = () => {
    eventProxy.trigger('SHOWNAVLEFT')
  }
  
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
    let FileAndStatistics = null
    if(this.props.board) {
      FileAndStatistics = (
        <span>
          <Icon type="folder-open" theme="outlined" onClick={this.showFile}/>
          <Icon type="bar-chart" theme="outlined" onClick={this.showStatistics}/>
        </span>
      )
    }
    return (
      <div className="center-header">
        <span className="show-left" onClick={this.showLeft}><Icon type="bars" /></span>
        <h5 className="title">{this.props.board ? this.props.board.name : this.props.title}</h5>
        <div className="tools">
          {FileAndStatistics}
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

export default withRouter(CenterHeader)