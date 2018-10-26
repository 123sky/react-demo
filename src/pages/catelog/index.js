import React, { Component } from 'react';
import {withRouter } from 'react-router';
import { Collapse, Input, Form } from 'antd';
import CenterHeader from './CenterHeader'
import CatelogItem from './CatelogItem'
import axios from '../../axios';
import './index.less';

const Panel = Collapse.Panel;
const FormItem = Form.Item;

class Catelog extends Component {

  state = {
    catelogList: []
  };

  componentDidMount () {
    this.getCatelog(this.props.match.params.boardId)
  }

  componentWillReceiveProps(props) {
    this.getCatelog(props.match.params.boardId)
  }

  getCatelog = async (uid) => {
    let res = await axios.ajax({ url: `catalog/list?board_id=${uid}`})
    
    this.setState ({
      catelogList: res.data
    }) 
  }

  setCurrentTask = (taskId) => {
    this.props.setCurrentTask(taskId)
  }

  handleWrittenContent = (str) => {
    this.props.handleWrittenContent(str)
  }

  updateTask = (data) => {
    this.props.updateTask(data)
  }

  creatTask (catelog, e) {
    if(e.keyCode !== 13) {
      return
    }
    axios.ajax({
      method: 'POST',
      url: 'task/',
      data: {
        catalog_id: catelog.uid,
        project_id: this.props.match.params.projectId,
        written_content: e.target.value
      }
    }).then(res=>{
      let catelogList = this.state.catelogList.map(catelogItem => {
        if (catelogItem.uid === catelog.uid) {
          catelogItem.task_list.unshift(res)
          return catelogItem
        } else {
          return catelogItem
        }
      })
      this.props.form.resetFields()
      this.setState ({ catelogList })
    })
  }

  renderCatelog = () => {
    const { getFieldDecorator } = this.props.form;
    return this.state.catelogList.map((catelog, index) => {
      let task = catelog.task_list.map(task => {
        return (
          <CatelogItem key={task.uid}
            data={{task, pathParams: this.props.match.params}}
            setCurrentTask = {(taskId=>{this.setCurrentTask(taskId)})}
            handleWrittenContent = {(str=>{this.handleWrittenContent(str)})}
            updateTask = {(data=>{this.updateTask(data)})}></CatelogItem>
        )
      })
      return (
        <Panel header={catelog.name} key={index+''}>
          <Form className="create-wrap">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input placeholder={`添加任务至"${catelog.name}"，回车即可保存`}
                  onKeyDown={this.creatTask.bind(this, catelog)}/>
              )}
            </FormItem>
          </Form>
          <div>
            
          </div>
          {task}
        </Panel>
      )
    })
  }

  render() {
    return (
      <div className="catelog">
        <CenterHeader board={this.props.board}></CenterHeader>
        <div className="collapse-wrap">
          <Collapse defaultActiveKey={['0']}>
            {this.renderCatelog()}
          </Collapse>
        </div>
      </div>
    );
  }
}

export default withRouter(Form.create()(Catelog));
