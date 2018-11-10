import React, { Component } from "react";
import { Icon, Menu, Dropdown } from "antd";
import "./index.less";
// import axios from "../../../axios";

class Header extends Component {

  state = {
    user: JSON.parse(sessionStorage.getItem("user")) || {}
  }

  getMenu = () => {
    return (
      <Menu>
        <Menu.Item>
          同步
        </Menu.Item>
        <Menu.Item>
          设置
        </Menu.Item>
        <Menu.Item>
          首页
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item>
          退出登陆
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item>
          应用
          <ul className="app-list">
            <li><Icon type="apple" /></li>
            <li><Icon type="android" /></li>
            <li><Icon type="wechat" /></li>
          </ul>
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item>
          更新日志
        </Menu.Item>
      </Menu>
    )
  }

  render() {
    return (
      <div className="header">
        <Dropdown overlay={this.getMenu()} trigger={['click']}>
          <div className="user">
            <img className="avatar" src={this.state.user.avatar} alt="头像" />
            <p className="user-name"> {this.state.user.name} </p>
          </div>
        </Dropdown>
        <div className="tools">
          <Icon type="bell" theme="outlined" />
          <Icon type="search" theme="outlined" />
        </div>
      </div>
    );
  }
}

export default Header;
