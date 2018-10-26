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
    currentBoard: {},
    currentProject: {},
    currentTask: {}
  }

  componentDidMount () {
    this.getProjectList()
    this.initTask()
  }

  // 获取项目列表，以及每个项目下的看板
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
  }

  setCurrentProject = (project) => {
    this.setState({currentProject: project})
  }

  setCurrentBoard = (board) => {
    this.setState({currentBoard: board})
  }

  setCurrentTask = (task) => {
    this.setState({currentTask: task})
  }

  /* 以下是数据修改 */
  handleWrittenContent = (str) => {
    console.log(str)
    this.setState({
      currentTask: {
        ...this.state.currentTask,
        written_content: str
      }
    })
  }

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
              return <Catelog board={this.state.currentBoard} 
                        setCurrentTask={(taskId) => this.initTask(taskId)}
                        handleWrittenContent = {(str=>{this.handleWrittenContent(str)})}
                        updateTask = {(data=>{this.updateTask(data)})}/>
            }}/>
          </Switch>
        </div>
        <div className="right">
          <Switch>
            <Route exact path='/project/:projectId/board/:catelogId/task/:taskId' render={()=>{
              return <Deitail project={this.state.currentProject} task={this.state.currentTask}/>
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
