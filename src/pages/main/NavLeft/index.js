import React, { Component } from "react";
import { Icon, Menu, Dropdown } from "antd";
import { NavLink } from 'react-router-dom'
import CreateProject from '../CreateProject'
import "./index.less";
import axios from "../../../axios";

const SubMenu = Menu.SubMenu;

class NavLeft extends Component {
  rootSubmenuKeys = ["all", "today", "recent", "finish", "trash"];

  state = {
    openKeys: [],
    selectedKeys: [],
    projectListDom: null,
    visible: false,
    user: JSON.parse(sessionStorage.getItem('user')) || {}
  };

  async componentDidMount() {
    this.initMenuOpenSelect()
  }

  componentWillReceiveProps (props) {
    this.renderMenu(props.projectList)
  }

  initMenuOpenSelect = (projectList) => {
    let pathName = window.location.hash.replace(/#|\?.*$/g, '')
    let pathNames = pathName.split('/')
    let selectedKeys = pathNames[1] === 'project' ? [pathNames[4]] : [pathName]
    let openKeys = [pathName.split('/')[2]] || []
    this.setState({selectedKeys})
    this.setState({openKeys})
  }

  onSelect = ({ item, key, selectedKeys }) => {
    this.setState({selectedKeys: [key]})
    this.props.initCurrentBoard(item.props.project, item.props.board)
  }

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    );
    if(latestOpenKey === 'create') {
      this.setState({visible: true})
      return
    }
    this.setState({
      openKeys: latestOpenKey ? [latestOpenKey] : []
    });
  }

  handleOperationClick = (e) => {
    e.stopPropagation()
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  handleSubmit = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      axios.ajax({
        method: 'Post',
        url: 'project/',
        data: values
      }).then(res=>{
        form.resetFields();
        this.setState({ visible: false });
      })
    });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  renderMenu = (projectList) => {
    let projectListDom = []
    const operationMenu = (
      <Menu>
        <Menu.Item key="1"><Icon type="form" theme="outlined" /><span>修 改</span></Menu.Item>
        <Menu.Item key="2"><Icon type="delete" theme="outlined" /><span>删 除</span></Menu.Item>
      </Menu>
    )
    projectList.forEach( (project) => {
      let boardListDom = []
      project.board.forEach (board=>{
        boardListDom.push((
          <Menu.Item key={board.uid} board={board.uid} project={project.uid}>
            <NavLink to={{pathname:`/project/${project.uid}/board/${board.uid}`}}>
              {board.name}
            </NavLink>
            <div className="operation" onClick={this.handleOperationClick}>
              <Dropdown overlay={operationMenu} trigger={['click']}>
                <Icon type="ellipsis" theme="outlined" />
              </Dropdown>
            </div>
          </Menu.Item>
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

    // 添加项目按钮
    projectListDom.push ((
      <SubMenu
        className="create-project"
        key="create"
        title={
          <span>
            <Icon type="plus-circle" theme="outlined" />
            <span>新建项目</span>
          </span>
        }>
      </SubMenu>
    ))
    this.setState({ projectListDom })
  }

  render() {
    return (
      <div className="nav-left">
        <div className="header">
          <div className="user">
            <img className="avatar" src={this.state.user.avatar} alt="头像" />
            <p className="user-name">{this.state.user.name}</p>
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
            onOpenChange={this.onOpenChange}
            selectedKeys={this.state.selectedKeys}
            onSelect={this.onSelect}
            style={{ width: '100%' }}>
            <Menu.Item
              key="/execute">
              <NavLink to={{pathname:'/myTask/execute'}}>
                <Icon type="mail" />
                <span>待完成</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item
              key="/creater">
              <NavLink to={{pathname:'/myTask/creater'}}>
                <Icon type="mail" />
                <span>我创建的</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item
              key="/today">
              <NavLink to={{pathname:'/myTask/today'}}>
                <Icon type="appstore" />
                <span>今天</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item
              key="/recent">
              <NavLink to={{pathname:'/myTask/recent'}}>
                <Icon type="appstore" />
                <span>最近7天</span>
              </NavLink>
            </Menu.Item>
            <Menu.Divider style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}/>
            {this.state.projectListDom}
            <Menu.Divider style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}/>
            <Menu.Item
              key="/finish">
              <NavLink to={{pathname:'/myTask/finish'}}>
                <Icon type="appstore" />
                <span>已完成</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item
              key="/trash">
              <NavLink to={{pathname:'/trash'}}>
                <Icon type="appstore" />
                <span>垃圾桶</span>
              </NavLink>
            </Menu.Item>
          </Menu>
        </div>
        <CreateProject
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onOk={this.handleSubmit}
        ></CreateProject>
      </div>
    );
  }
}

export default NavLeft;
