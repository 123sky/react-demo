import React, { Component } from "react";
import { Icon, Menu, Dropdown } from "antd";
import "./index.less";
import axios from "../../../axios";

const SubMenu = Menu.SubMenu;

class Header extends Component {

  state = {
    user: JSON.parse(sessionStorage.getItem("user")) || {}
  }

  render() {
    return (
      <div className="header">
        <div className="user">
          <img className="avatar" src={this.state.user.avatar} alt="头像" />
          <p className="user-name"> {this.state.user.name} </p>{" "}
        </div>{" "}
        <div className="tools">
          <Icon type="bell" theme="outlined" />
          <Icon type="search" theme="outlined" />
        </div>{" "}
      </div>
    );
  }
}

export default Header;
