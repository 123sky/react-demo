import React, { Component } from "react";
import { Icon, Menu } from "antd";
import axios from '../../axios';
import "./index.less";
import logo from "./logo.svg";

const SubMenu = Menu.SubMenu;

class NavLeft extends Component {
  rootSubmenuKeys = ["all", "today", "recent", "finish", "trash"];

  state = {
    openKeys: ["all"],
    projectListDom: ''
  };

  async componentDidMount(){
    this.getUser()
    this.getProjectList()
  }

  onOpenChange = openKeys => {
    console.log(openKeys)
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    );
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : []
      });
    }
  };

  onSelect = ({ item, key, selectedKeys }) => {
    if(!key.startsWith('static-')){
      
    }
  }

  getUser = () => {

  }

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
    this.setprojectListDom(projectList)
  }

  setprojectListDom = (projectList) => {
    let projectListDom = []
    projectList.data.forEach( (project) => {

      let boardListDom = []
      project.board.forEach (board=>{
        boardListDom.push((
          <Menu.Item key={board.uid}>{board.name}</Menu.Item>
        ))
      })

      projectListDom.push ((
        <SubMenu
          key={project.uid}
          title={
            <span>
              <Icon type="setting" />
              <span>{project.name}</span>
            </span>
          }>
          {boardListDom}
        </SubMenu>
      ))
    })
    this.setState({ projectListDom })
  }

  render() {
    return (
      <div className="nav-left">
        <div className="header">
          <div className="user">
            <img className="avatar" src={logo} alt="头像" />
            <p className="user-name">陈建朋</p>
          </div>
          <div className="tools">
            <Icon type="bell" theme="outlined" />
            <Icon type="search" theme="outlined" />
          </div>
        </div>
        <div className="menu-wrap">
          <Menu
            mode="inline"
            theme="dark"
            openKeys={this.state.openKeys}
            defaultSelectedKeys={['all']}
            onSelect={this.onSelect}
            onOpenChange={this.onOpenChange}
            style={{ width: '100%' }}>
            <Menu.Item
              key="static-all">
              <span>
                <Icon type="mail" />
                <span>所有任务</span>
              </span>
            </Menu.Item>
            <Menu.Item
              key="static-today">
              <span>
                <Icon type="appstore" />
                <span>今天</span>
              </span>
            </Menu.Item>
            <Menu.Item
              key="static-recent">
              <span>
                <Icon type="appstore" />
                <span>最近7天</span>
              </span>
            </Menu.Item>
            <Menu.Divider />
            {this.state.projectListDom}
            <Menu.Divider />
            <Menu.Item
              key="static-finish">
              <span>
                <Icon type="appstore" />
                <span>已完成</span>
              </span>
            </Menu.Item>
            <Menu.Item
              key="static-trash">
              <span>
                <Icon type="appstore" />
                <span>垃圾桶</span>
              </span>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    );
  }
}

export default NavLeft;
