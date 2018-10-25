import React, { Component } from 'react';
import { Checkbox, Input, Icon, Avatar  } from 'antd';
import {withRouter } from 'react-router';
import './index.less';
  
const { TextArea } = Input;

class CatelogItem extends Component {

  onChange = () => {

  }

  detail = () => {
    this.props.history.push(`/project/${this.props.data.pathParams.projectId}/board/${this.props.data.pathParams.boardId}/task/${this.props.data.task.uid}`)
  }

  getAvatar = () => {
    if(this.props.data.task.executor) {
      return (
        <Avatar title={'执行者：' + this.props.data.task.executor.name} size="small" src={this.props.data.task.executor.avatar}></Avatar>
      )
    }
  }

  render() {
    return (
      <div className="catelog-item" onClick={this.detail}>
        <div className="checkbox">
          <Checkbox onChange={this.onChange}></Checkbox>
        </div>
        <div className="input">
          <TextArea autosize defaultValue={this.props.data.task.written_content}/>
          {this.getAvatar()}
        </div>
        <div className="more">
          <Icon type="ellipsis" theme="outlined" />
        </div>
      </div>
    );
  }
}

export default withRouter(CatelogItem)