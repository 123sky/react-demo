import React, { Component } from 'react';
import { Checkbox,Icon, Avatar, Tag, Input, DatePicker } from 'antd';
import CommentMention from './CommentMention'
import {withRouter } from 'react-router';
import axios from '../../axios'
import './index.less';
import moment from 'moment'

const {TextArea} = Input

class Detail extends Component {

  getParticipant = () => {
    if(!this.props.task.participant){
      return
    }
    
    return this.props.task.participant.map( participant => {
      return (
        <Avatar key={participant.uid} src={participant.avatar} title={participant.name}></Avatar>
      )
    })
  }

  getTag = () => {
    switch (this.props.task.level) {
      case 0 :
        return <Tag color="#f81d32">紧急</Tag>
      case 1 :
        return <Tag color="#f8841d">重要</Tag>
      case 2 :
        return <Tag color="#28d4ae">普通</Tag>
      default:
        return ''
    }
  }

  getProcessDom = () => {
    return this.props.process.map(process => {
      switch (process.action) {
        case -1 :
          return this.getCommentDom(process)
        default: 
          return this.getHistoryDom(process)
      }
    })
  }

  getCommentDom = (process) => {
    return (
      <div key={process.uid} className={'comment ' + (process.user.uid === '137e0c7a-08ab-4217-b7b0-2d987d1fd03f'?'my-comment':'')}>
        <Avatar src={process.user.avatar} key={process.user.uid}></Avatar>
        <div className={'talk ' + (process.user.uid === '137e0c7a-08ab-4217-b7b0-2d987d1fd03f'?'margin-right':'margin-left')}>
          <div className={'text ' + (process.user.uid === '137e0c7a-08ab-4217-b7b0-2d987d1fd03f'?'text-left':'text-right')}>{process.content}</div>
        </div>
      </div>
    )
  }

  getHistoryDom = (process) => {
    let operation
    switch (process.action) {
      case 0 :
        operation = '创建了任务'
        break
      case 1 :
        operation = '更改了'
        break
      case 2 :
        operation = '删除了任务'
        break
      case 3 :
        operation = '下载了'
        break
      case 4 :
        operation = '收到了任务'
        break
      default: 
        operation = ''
    }
    return (
      <div key={process.uid} className="history">
        <div className="history-text">
          <span>{process.user.name}</span>
          <span>{operation}</span>
          <span>{process.content}</span>
        </div>
      </div>
    )
  }

  getExecutor = () => {
    if(this.props.task.executor){
      return (
        <Avatar title={'执行者：'+this.props.task.executor.name} src={this.props.task.executor.avatar}></Avatar>
      )
    }
  }

  render() {
    return (
      <div className="detail">
        <div className="detail-content">
          <div className="detail-header">
            <div className="checkbox">
              <Checkbox onChange={this.onChange} key={this.props.task.is_finished} defaultChecked={this.props.task.is_finished === 1}></Checkbox>
            </div>
            <div className="header-center">
              <div className="level">{this.getTag()}</div>
              <Icon type="calendar" theme="outlined" style={{fontSize: '16px', marginRight: '5px'}}/>
              <div className="date-picker-wrap">
                <DatePicker
                  key={this.props.task.uid}
                  defaultValue={this.props.task.deadline ? moment(new Date(this.props.task.deadline)): null}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss" 
                  placeholder="截至日期"/>
              </div>
            </div>
            {this.getExecutor()}
          </div>
          <div className="content">
            <div className="title">
              <TextArea autosize defaultValue={this.props.task.written_content} key={this.props.task.written_content}/>
            </div>
            <div className="note">
              <TextArea autosize defaultValue={this.props.task.note} key={this.props.task.note} placeholder="描述"/>
            </div>
            <div className="file">
              <div className="sub-title">关联文件 · {this.props.task.files?this.props.task.files.length:0}</div>
              <div className="file-list">
                <div className="add-file">
                  <Icon type="plus-circle" theme="outlined" />
                </div>
              </div>
            </div>
          </div>
          <div className="process">
            <div className="avatar-list-wrap">
              <div className="sub-title">参与者 · {this.props.task.participant?this.props.task.participant.length:0}</div>
              <div className="avatar-list">{this.getParticipant()}</div>
            </div>
            {this.getProcessDom()}
          </div>
        </div>
        <div className="mention">
          <CommentMention members={this.props.project.members}/>
        </div>
      </div>
      
    );
  }
}

export default withRouter (Detail);
