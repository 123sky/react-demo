import React, { Component } from 'react';
import { Route, Switch} from 'react-router-dom'
import NavLeft from './NavLeft';
import Catelog from '../catelog'
import Deitail from '../deitail'
import Statistics from '../statistics'
import File from '../file'
import axios from '../../axios';
import './index.less';

class Main extends Component {

  state = {
    projectList: [],
    currentProject: {},
    currentBoard: {},
    CurrentCatelogs: [],
    currentTask: {},
    currentProcess: []
  }

  componentDidMount () {
    this.getProjectList()
    this.initTask()
    this.initCatelogs()
  }

  /*
   * 以下是数据获取
   ---------------------------------------------------------------------------------- */

  getProjectList = async () => {
    let projectList = await axios.ajax({ url:'project/list/?user_id=137e0c7a-08ab-4217-b7b0-2d987d1fd03f' })
    console.log()
    let boardAjaxList = []
    projectList.data.forEach(project => {
      boardAjaxList.push(
        new Promise(resolve=>{
          axios.ajax({
            url : `board/list/?project_id=${project.uid}`
          }).then(res=>{
            project.board = res.data
            resolve()
          })
        })
      )
    })
    await Promise.all(boardAjaxList)
    this.setState({projectList: projectList.data})
    this.initCurrentBoard()
  }

  initCurrentBoard = (projectId, boradId) => {
    if(!projectId || !boradId) {
      let pathName = window.location.hash.replace(/#|\?.*$/g, '')
      let pathNames = pathName.split('/')
      projectId = pathNames[2]
      boradId = pathNames[4]
    }

    let project = this.state.projectList.find(project => {return project.uid === projectId})
    this.setCurrentProject(project || {})
    let board = project ? project.board.find(board => {return board.uid === boradId}) : {}
    this.setCurrentBoard(board || {})
    this.initCatelogs(board.uid)
  }

  initCatelogs = async (boradId) => {
    if(!boradId) {
      let pathName = window.location.hash.replace(/#|\?.*$/g, '')
      let pathNames = pathName.split('/')
      boradId = pathNames[4]
    }
    if(!boradId){ return }
    let res = await axios.ajax({ url: `catalog/list?board_id=${boradId}`})
    
    this.setState ({ CurrentCatelogs: res.data }) 
  }

  initTask = async taskId => {
    if(!taskId) {
      let pathName = window.location.hash.replace(/#|\?.*$/g, '')
      let pathNames = pathName.split('/')
      taskId = pathNames[6]
    }
    if(!taskId){return}
    let res = await axios.ajax({url: `task/${taskId}/`})
    this.setCurrentTask(res || {})
    this.getProcess(taskId)
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
      this.setCurrentProcess(list || [])
    })
  }

   /*
   * 以下是数据设置
   ---------------------------------------------------------------------------------- */

  setCurrentProject = (project) => {
    this.setState({currentProject: project})
  }

  setCurrentBoard = (board) => {
    this.setState({currentBoard: board})
  }

  setCurrentTask = (task) => {
    this.setState({currentTask: task})
  }

  setCurrentProcess = (process) => {
    this.setState({currentProcess: process})
  }

  handleTaskChange = (type, val) => {
    this.setState({
      currentTask: {
        ...this.state.currentTask,
        [type]: val
      }
    })
  }

  /*
   * 以下是数据修改
   ---------------------------------------------------------------------------------- */

  updateTask = (data) => {
    let uid = data.uid
    delete data.uid
    axios.ajax({
      method: 'PUT',
      url: 'task/' + uid,
      data
    })
  }

  render() {
    return (
      <div className="main">
        <div className="left">
          <NavLeft projectList={this.state.projectList} 
            initCurrentBoard={(projectId, boradId) => this.initCurrentBoard(projectId, boradId)}></NavLeft>
        </div>
        <div className="center">
          <Switch>
            <Route path='/project/:projectId/board/:boardId' render={()=>{
              return (
                <Catelog board={this.state.currentBoard}
                  catelogList={this.state.CurrentCatelogs}
                  setCurrentTask={(taskId) => this.initTask(taskId)}
                  handleTaskChange = {((type, val)=>{this.handleTaskChange(type, val)})}
                  updateTask = {(data=>{this.updateTask(data)})}/>
              )
            }}/>
          </Switch>
        </div>
        <div className="right">
          <Switch>
            <Route exact path='/project/:projectId/board/:catelogId/task/:taskId' render={()=>{
              return <Deitail project={this.state.currentProject} task={this.state.currentTask} process={this.state.currentProcess}/>
            }}/>
            <Route exact path='/project/:projectId/board/:catelogId/file' component={File} />
            <Route exact path='/project/:projectId/board/:catelogId/statistics' component={Statistics} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Main;
