import React, { Component } from 'react';
import { Checkbox, Input, Icon, Avatar, Dropdown, Menu } from 'antd';
import {withRouter } from 'react-router';
import './index.less';

const menu = (
  <Menu>
    <Menu.Item key="1">日期</Menu.Item>
    <Menu.Item key="2">优先级</Menu.Item>
    <Menu.Item key="3">删除</Menu.Item>
  </Menu>
)

class CatelogItem extends Component {

  onChange = (e) => {
    
  }

  detail = () => {
    this.props.history.push(`/project/${this.props.data.pathParams.projectId}/board/${this.props.data.pathParams.boardId}/task/${this.props.data.task.uid}`)
    this.props.setCurrentTask(this.props.data.task.uid)
  }

  getAvatar = () => {
    if(this.props.data.task.executor) {
      return (
        <Avatar title={'执行者：' + this.props.data.task.executor.name} size="small" 
          src={this.props.data.task.executor.avatar}></Avatar>
      )
    } else {
      return (
        <Icon type="smile" theme="outlined" className="add-executor"/>
      )
    }
  }

  handleWrittenContent = (e) => {
    this.props.handleWrittenContent(e.target.value);
  }

  updateTask = (e) => {
    this.props.updateTask({written_content: e.target.value, uid: this.props.data.task.uid});
  }

  render() {
    return (
      <div className="catelog-item" style={{opacity: this.props.data.task.is_finished === 1?'0.5':'1'}}>
        <div className="checkbox">
          <Checkbox onChange={this.onChange} 
            defaultChecked={this.props.data.task.is_finished === 1}></Checkbox>
        </div>
        <div className="input" onClick={this.detail}>
          <Dropdown overlay={menu} trigger={['contextMenu']}>
            <Input defaultValue={this.props.data.task.written_content} 
              onChange={this.handleWrittenContent} 
              onBlur={this.updateTask}/>
          </Dropdown>
        </div>
        <div className="avatar-wrap">
          {this.getAvatar()}
        </div>
        <div className="more">
          <Dropdown overlay={menu} trigger={['click']}>
            <Icon type="ellipsis" theme="outlined" />
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default withRouter(CatelogItem)