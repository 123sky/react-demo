import React, { Component } from 'react';
import { Checkbox, Input, Icon, Avatar, Dropdown, Menu } from 'antd';
import {withRouter } from 'react-router';
import './index.less';

class CatalogItem extends Component {

  detail = (e) => {
    e.stopPropagation()
    this.props.handleDetail(this.props.data.task.uid)
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

  getMenu = (task) => {
    return (
      <Menu>
        <Menu.Item key="1">日期</Menu.Item>
        <Menu.Item key="2">优先级</Menu.Item>
        <Menu.Item key="3" onClick={this.deleteTask} task={task}>删除</Menu.Item>
      </Menu>
    )

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

  deleteTask = ({item:{props:{task}}}) => {
    this.props.delTask(task)
  }

  render() {
    return (
      <div className="catalog-item" style={{opacity: this.props.data.task.is_finished === 1?'0.5':'1'}}>
        <div className="checkbox">
          <Checkbox onChange={this.handleTaskChange.bind(this, 'is_finished')}
            defaultChecked={this.props.data.task.is_finished === 1}></Checkbox>
        </div>
        <div className="input" onClick={this.detail}>
          <Dropdown overlay={this.getMenu(this.props.data.task)} trigger={['contextMenu']}>
            <Input defaultValue={this.props.data.task.written_content} 
              onChange={this.handleTaskChange.bind(this, 'written_content')} 
              onBlur={this.updateTask.bind(this, 'written_content')}/>
          </Dropdown>
        </div>
        <div className="avatar-wrap">
          {this.getAvatar()}
        </div>
        <div className="more">
          <Dropdown overlay={this.getMenu(this.props.data.task)} trigger={['click']}>
            <Icon type="ellipsis" theme="outlined" />
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default withRouter(CatalogItem)