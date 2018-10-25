import React, { Component } from 'react';
import { Checkbox,Icon, Avatar, Tag, Input, DatePicker } from 'antd';
import CommentMention from './CommentMention'
import axios from '../../axios'
import './index.less';
import moment from 'moment'

const {TextArea} = Input

class Detail extends Component {

  state = {
    data: {},
    process: []
  }

  componentDidMount () {
    this.getTaskDetail(this.props.match.params.taskId)
    this.getProcess(this.props.match.params.taskId)
  }

  componentWillReceiveProps (props) {
    this.getTaskDetail(props.match.params.taskId)
    this.getProcess(props.match.params.taskId)
  }

  getTaskDetail = async (uid) => {
    let res = await axios.ajax({url: `task/${uid}/`})
    this.setState({data: res || {}})
  }

  getProcess = (task_id) => {
    Promise.all([axios.ajax({url: `task_comment/list/?task_id=${task_id}`}), axios.ajax({url: `task_history/list/?task_id=${task_id}`})]).then((res) => {
      let list = []
      // 评论
      if (res[0].data && res[0].data.length > 0) {
        let data = []
        res[0].data.forEach(element => {
          element.action = -1
          element.dateTime = element.create_time
          data.push(element)
        });
        list = list.concat(data)
      }
      // 历史记录
      if (res[1].data && res[1].data.length > 0) {
        let data = []
        res[1].data.forEach(element => {
          element.dateTime = element.create_time
          data.push(element)
        });
        list = list.concat(data)
      }
      list.sort(function(last,next){
        return new Date(next.create_time).getTime() - new Date(last.create_time).getTime()
      })
      this.setState({process: list})
    })
  }

  getParticipant = () => {
    if(!this.state.data.participant){
      return
    }
    
    return this.state.data.participant.map( participant => {
      return (
        <Avatar key={participant.uid} src={participant.avatar} title={participant.name}></Avatar>
      )
    })
  }

  getTag = () => {
    switch (this.state.data.level) {
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
    return this.state.process.map(process => {
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
    if(this.state.data.executor){
      return (
        <Avatar title={'执行者：'+this.state.data.executor.name} src={this.state.data.executor.avatar}></Avatar>
      )
    }
  }

  render() {
    return (
      <div className="detail">
        <div className="detail-content">
          <div className="detail-header">
            <div className="checkbox">
              <Checkbox onChange={this.onChange}></Checkbox>
            </div>
            <div className="header-center">
              <div className="level">{this.getTag()}</div>
              <Icon type="calendar" theme="outlined" style={{fontSize: '16px', marginRight: '5px'}}/>
              <div className="date-picker-wrap">
                <DatePicker
                  defaultValue={moment(this.state.data.deadline)}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss" 
                  placeholder="截至日期"/>
              </div>
            </div>
            {this.getExecutor()}
          </div>
          <div className="content">
            <div className="title">
              <TextArea autosize defaultValue={this.state.data.written_content} key={this.state.data.written_content}/>
            </div>
            <div className="note">
              <TextArea autosize defaultValue={this.state.data.note} key={this.state.data.note} placeholder="描述"/>
            </div>
            <div className="file">
              <div className="sub-title">关联文件 · {this.state.data.files?this.state.data.files.length:0}</div>
              <div className="file-list">
                <div className="add-file">
                  <Icon type="plus-circle" theme="outlined" />
                </div>
              </div>
            </div>
          </div>
          <div className="process">
            <div className="avatar-list-wrap">
              <div className="sub-title">参与者 · {this.state.data.participant?this.state.data.participant.length:0}</div>
              <div className="avatar-list">{this.getParticipant()}</div>
            </div>
            {this.getProcessDom()}
          </div>
        </div>
        <div className="mention">
          <CommentMention/>
        </div>
      </div>
      
    );
  }
}

export default Detail;
