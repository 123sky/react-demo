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

  handleTaskChange (type, e) {
    if(type === 'is_finished') {
      this.props.handleTaskChange(type, e.target.checked ? 1 : 0);
      this.updateTask(type, e)
      return
    }
    this.props.handleTaskChange(type, e.target.value);
  }

  updateTask = (type, e) => {
    if(type === 'is_finished') {
      this.props.updateTask({[type]: e.target.checked, uid: this.props.data.task.uid});
      return
    }
    this.props.updateTask({[type]: e.target.value, uid: this.props.data.task.uid});
  }

  render() {
    return (
      <div className="catelog-item" style={{opacity: this.props.data.task.is_finished === 1?'0.5':'1'}}>
        <div className="checkbox">
          <Checkbox onChange={this.handleTaskChange.bind(this, 'is_finished')}
            defaultChecked={this.props.data.task.is_finished === 1}></Checkbox>
        </div>
        <div className="input" onClick={this.detail}>
          <Dropdown overlay={menu} trigger={['contextMenu']}>
            <Input defaultValue={this.props.data.task.written_content} 
              onChange={this.handleTaskChange.bind(this, 'written_content')} 
              onBlur={this.updateTask.bind(this, 'written_content')}/>
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