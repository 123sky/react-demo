import React, { Component } from "react";
import { Icon, Menu, Dropdown, Divider } from "antd";
import { NavLink } from "react-router-dom";
import CreateProject from "../../../components/CreateProject";
import "./index.less";
import axios from "../../../axios";

const SubMenu = Menu.SubMenu;

class ProjectAndBoard extends Component {
  state = {
    projectListDom: null,
    dialog: {
      visible: false,
      title: "",
      type: null
    }
  };

  componentWillReceiveProps({ projectList }) {
    this.renderMenu(projectList);
  }

  handleOperationClick = e => {
    e.stopPropagation();
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  handleDialogSubmit = (type, uid) => {
    switch (type) {
      case "createProject":
        this.handleCreateProject();
        break;
      case "updateProject":
        this.handleUpdateProject(uid);
        break;
      case "createBoard":
        this.handleCreateBoard(uid);
        break;
      case "updateBoard":
        this.handleUpdateBoard(uid);
        break;
      default:
        return;
    }
  };

  handleCancel = () => {
    this.setState({
      dialog: {
        visible: false,
        title: "",
        type: "null"
      }
    });
  };

  /*
   * project ---------------------------------------------------------------------------
   */

  beforeCreateProject = element => {
    this.setState({
      dialog: {
        visible: true,
        title: "新建项目",
        type: "createProject"
      }
    });
  };

  handleCreateProject = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      axios
        .ajax({
          method: "Post",
          url: "project/",
          data: values
        })
        .then(res => {
          this.props.getProjectList();
          form.resetFields();
          this.setState({
            dialog: {
              visible: false,
              title: "",
              type: "null"
            }
          });
        });
    });
  };

  beforeUpdateProject = element => {
    let {
      item: {
        props: {
          project: { name, uid }
        }
      }
    } = element;
    this.setState({
      dialog: {
        visible: true,
        title: "编辑项目",
        type: "updateProject",
        uid,
        name
      }
    });
  };

  handleUpdateProject = uid => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      axios
        .ajax({
          method: "PUT",
          url: `project/${uid}/`,
          data: values
        })
        .then(res => {
          this.props.getProjectList();
          form.resetFields();
          this.setState({
            dialog: {
              visible: false,
              title: "",
              type: "null"
            }
          });
        });
    });
  };

  handleDeleteProject = element => {
    axios
      .ajax({
        method: "DELETE",
        url: `project/${element.item.props.project.uid}/`
      })
      .then(res => {
        this.props.getProjectList();
      });
  };

  /*
   * board ---------------------------------------------------------------------------
   */

  beforeCreateBoard = element => {
    this.setState({
      dialog: {
        visible: true,
        title: "新建看板",
        type: "createBoard",
        uid: element.item.props.project.uid
      }
    });
  };

  handleCreateBoard = projectId => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values["project_id"] = projectId;
      console.log(values);
      axios
        .ajax({
          method: "Post",
          url: "board/",
          data: values
        })
        .then(res => {
          this.props.getProjectList();
          form.resetFields();
          this.setState({
            dialog: {
              visible: false,
              title: "",
              type: "null"
            }
          });
        });
    });
  };

  beforeUpdateBoard = element => {
    let {
      item: {
        props: {
          board: { name, uid }
        }
      }
    } = element;
    this.setState({
      dialog: {
        visible: true,
        title: "编辑看板",
        type: "updateBoard",
        uid,
        name
      }
    });
  };

  handleUpdateBoard = uid => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      axios
        .ajax({
          method: "PUT",
          url: `board/${uid}/`,
          data: values
        })
        .then(res => {
          this.props.getProjectList();
          form.resetFields();
          this.setState({
            dialog: {
              visible: false,
              title: "",
              type: "null"
            }
          });
        });
    });
  };

  handleDeleteBoard = element => {
    axios
      .ajax({
        method: "DELETE",
        url: `board/${element.item.props.board.uid}/`
      })
      .then(res => {
        this.props.getProjectList();
      });
  };

  /*
   * menu ----------------------------------------------------------------------------
   */

  getProjectMenu = project => {
    return (
      <Menu>
        <Menu.Item key="0" onClick={this.beforeCreateBoard} project={project}>
          <Icon type="form" />
          <span> 新建看板 </span>
        </Menu.Item>
        <Menu.Item key="1" onClick={this.beforeUpdateProject} project={project}>
          <Icon type="form" />
          <span> 修 改 </span>
        </Menu.Item>
        <Menu.Item key="2" onClick={this.handleDeleteProject} project={project}>
          <Icon type="delete" />
          <span> 删 除 </span>
        </Menu.Item>
      </Menu>
    );
  };

  getBoardMenu = board => {
    return (
      <Menu>
        <Menu.Item key="1" onClick={this.beforeUpdateBoard} board={board} >
          <Icon type="form" theme="outlined" />
          <span> 修 改 </span>
        </Menu.Item>
        <Menu.Item key="2" onClick={this.handleDeleteBoard} board={board} >
          <Icon type="delete" theme="outlined" />
          <span> 删 除 </span>
        </Menu.Item>
      </Menu>
    );
  };

  renderMenu = projectList => {
    let projectListDom = [];
    projectList.forEach(project => {
      let boardListDom = [];
      project.board.forEach(board => {
        boardListDom.push(
          <Menu.Item key={board.uid} board={board.uid} project={project.uid}>
            <NavLink
              to={{
                pathname: `/project/${project.uid}/board/${board.uid}`
              }}
            >
              {board.name}
            </NavLink>
            <div className="operation" onClick={this.handleOperationClick}>
              <Dropdown overlay={this.getBoardMenu(board)} trigger={["click"]}>
                <Icon type="ellipsis" theme="outlined" />
              </Dropdown>
            </div>
          </Menu.Item>
        );
      });

      projectListDom.push(
        <SubMenu
          key={project.uid}
          title={
            <span>
              <Icon type="setting" />
              <span> {project.name} </span>
              <span className="operation" onClick={this.handleOperationClick}>
                <Dropdown
                  overlay={this.getProjectMenu(project)}
                  trigger={["click"]}
                >
                  <Icon type="ellipsis" theme="outlined" />
                </Dropdown>
              </span>
            </span>
          }
        >
          {boardListDom}
        </SubMenu>
      );
    });
    this.setState({
      projectListDom
    });
  };

  render() {
    return (
      <div>
        <Divider className="divider" />
        <Menu
          mode="inline"
          theme="dark"
          openKeys={this.props.openKeys}
          onOpenChange={this.props.onOpenChange}
          selectedKeys={this.props.selectedKeys}
          onSelect={this.props.onSelect}
          style={{
            width: "100%"
          }}
        >
          {this.state.projectListDom}
        </Menu>
        <div className="create" onClick={this.beforeCreateProject}>
          <Icon type="plus-circle" theme="outlined" />
          <span> 新建项目 </span>
        </div>
        <CreateProject
          options={this.state.dialog}
          wrappedComponentRef={this.saveFormRef}
          onCancel={this.handleCancel}
          onOk={this.handleDialogSubmit}
        />
        <Divider className="divider" />
      </div>
    );
  }
}

export default ProjectAndBoard;
