import React, { Component } from "react";
import { Icon, Menu } from "antd";
import { NavLink } from "react-router-dom";
import Header from "./Header";
import ProjectAndBoard from "./ProjectAndBoard";
import "./index.less";

class NavLeft extends Component {
  state = {
    openKeys: [],
    selectedKeys: [],
    projectList: []
  };

  async componentDidMount() {
    this.initMenuOpenSelect();
  }

  componentWillReceiveProps({ projectList }) {
    this.setState({ projectList });
  }

  initMenuOpenSelect = () => {
    let pathName = window.location.hash.replace(/#|\?.*$/g, "");
    let pathNames = pathName.split("/");
    let selectedKeys = pathNames[1] === "project" ? [pathNames[4]] : [pathName];
    let openKeys = [pathName.split("/")[2]] || [];
    this.setState({
      selectedKeys
    });
    this.setState({
      openKeys
    });
  };

  onSelect = ({ item, key, selectedKeys }) => {
    this.setState({
      selectedKeys: [key]
    });
    this.props.initCurrentBoard(item.props.project, item.props.board);
    this.props.closeLeft()
  };

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1
    );
    this.setState({
      openKeys: latestOpenKey ? [latestOpenKey] : []
    });
  };

  render() {
    return (
      <div className="nav-left">
        <Header />
        <div className="menu-wrap">
          <Menu
            mode="inline"
            theme="dark"
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange}
            selectedKeys={this.state.selectedKeys}
            onSelect={this.onSelect}
            style={{
              width: "100%"
            }}
          >
            <Menu.Item key="/myTask/execute">
              <NavLink
                to={{
                  pathname: "/myTask/execute"
                }}
              >
                <Icon type="mail" />
                <span> 待完成 </span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="/myTask/creater">
              <NavLink
                to={{
                  pathname: "/myTask/creater"
                }}
              >
                <Icon type="mail" />
                <span> 我创建的 </span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="/myTask/today">
              <NavLink
                to={{
                  pathname: "/myTask/today"
                }}
              >
                <Icon type="appstore" />
                <span> 今天 </span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="/myTask/recent">
              <NavLink
                to={{
                  pathname: "/myTask/recent"
                }}
              >
                <Icon type="appstore" />
                <span> 最近7天 </span>
              </NavLink>
            </Menu.Item>
          </Menu>
          <ProjectAndBoard 
            projectList={this.state.projectList}
            openKeys={this.state.openKeys}
            onOpenChange={(params)=>{this.onOpenChange(params)}}
            selectedKeys={this.state.selectedKeys}
            onSelect={(params)=>{this.onSelect(params)}}
            getProjectList={()=>{this.props.getProjectList()}}
          />
          <Menu
            mode="inline"
            theme="dark"
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange}
            selectedKeys={this.state.selectedKeys}
            onSelect={this.onSelect}
            style={{
              width: "100%"
            }}
          >
            <Menu.Item key="/myTask/finish">
              <NavLink
                to={{
                  pathname: "/myTask/finish"
                }}
              >
                <Icon type="appstore" />
                <span> 已完成 </span>
              </NavLink>
            </Menu.Item>
            <Menu.Item key="/trash">
              <NavLink
                to={{
                  pathname: "/trash"
                }}
              >
                <Icon type="appstore" />
                <span> 垃圾桶 </span>
              </NavLink>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    );
  }
}

export default NavLeft;
