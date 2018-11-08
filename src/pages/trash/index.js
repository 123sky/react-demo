import React, { Component } from "react";
import { withRouter } from "react-router";
import CenterHeader from "../../components/CenterHeader";
import CatalogItem from "../../components/CatalogItem";
import axios from "../../axios";
import "./index.less";

class Trash extends Component {

  state = {
    taskList: []
  }

  componentDidMount () {
    this.getMyTask()
  }

  getMyTask = async () => {
    let res = await axios.ajax({ url: `task/list/?user_id=${JSON.parse(sessionStorage.getItem('user')).uid}` })
    // TODO 应返回本人删除的
    this.setState({ taskList: res.data.filter(item=>item.status === 1) })
  }

  setCurrentTask = taskId => {
    this.props.setCurrentTask(taskId);
  };

  handleTaskChange = (type, val) => {
    this.props.handleTaskChange(type, val);
  };

  updateTask = data => {
    this.props.updateTask(data);
  };

  delTask = task => {
    axios
      .ajax({
        method: "DELETE",
        url: "task/" + task.uid + "/"
      })
      .then(res => {
        this.state.taskList.splice(
          this.state.taskList.findIndex(item => item.uid === task.uid),
          1
        );
        this.setState({ taskList: this.state.taskList });
      });
  };

  creatTask(catalog, e) {
    if (e.keyCode !== 13) {
      return;
    }
  };

  renderTaskList = () => {
    let task = this.state.taskList.map(task => {
      return (
        <CatalogItem
          key={task.uid}
          data={{ task }}
          handleTaskChange={(type, val) => {
            this.handleTaskChange(type, val);
          }}
          updateTask={data => {
            this.updateTask(data);
          }}
          delTask={task => {
            this.delTask(task);
          }}
          handleDetail={taskId => {
            this.props.history.push(`/execute/${taskId}`)
            this.setCurrentTask(taskId);
          }}
        />
      );
    });
    return (
      <div class="list">
        {task}
      </div>
    );
  };

  render() {
    return (
      <div className="execute">
        <CenterHeader title="已删除" />
        {this.renderTaskList()}
      </div>
    );
  }
}

export default withRouter(Trash);
