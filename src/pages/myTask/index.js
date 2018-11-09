import React, { Component } from "react";
import { withRouter } from "react-router";
import CenterHeader from "../../components/CenterHeader";
import CatalogItem from "../../components/CatalogItem";
import axios from "../../axios";
import "./index.less";

class MyTask extends Component {
  state = {
    taskList: [],
    type: null,
    typeObject: {}
  };

  com;

  componentDidMount() {
    if (this.props.match.params.type !== this.state.type) {
      this.setState({ type: this.props.match.params.type });
      this.getMyTask(this.props);
    }
  }

  componentWillReceiveProps(props) {
    if (props.match.params.type !== this.state.type) {
      this.setState({ type: props.match.params.type });
      this.getMyTask(props);
    }
  }

  getMyTask = props => {
    if (!JSON.parse(sessionStorage.getItem("user"))) {
      return 
    }
    let userId = JSON.parse(sessionStorage.getItem("user")).uid;
    let typeObject = {
      execute: {
        name: "待完成",
        url: `task/list/?executor_id=${userId}`
      },
      creater: {
        name: "我创建的",
        url: `task/list/?user_id=${userId}`
      },
      today: {
        name: "今天",
        url: `task/list/?executor_id=${userId}`
      },
      recent: {
        name: "最近7天",
        url: `task/list/?executor_id=${userId}`
      },
      finish: {
        name: "已完成",
        url: `task/list/?executor_id=${userId}`
      }
    };
    this.setState({ typeObject }, async () => {
      let res = await axios.ajax({ url: this.state.typeObject[props.match.params.type].url });
      this.setState({ taskList: res.data });
    });
  };

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
        this.setState({
          taskList: this.state.taskList
        });
      });
  };

  creatTask(catalog, e) {
    if (e.keyCode !== 13) {
      return;
    }
  }

  renderTaskList = () => {
    let task = this.state.taskList.map(task => {
      // TODO 后台是否应该直接返回status为1的数据
      if (task.status === 0) {
        return "";
      }
      return (
        <CatalogItem
          key={task.uid}
          data={{
            task
          }}
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
            this.props.history.push(
              `/myTask/${this.props.match.params.type}/${taskId}`
            );
            this.setCurrentTask(taskId);
          }}
        />
      );
    });
    return <div className="list"> {task} </div>;
  };

  render() {
    return (
      <div className="execute">
        <CenterHeader
          title={
            this.state.typeObject[this.props.match.params.type]
              ? this.state.typeObject[this.props.match.params.type].name
              : ""
          }
        />{" "}
        {this.renderTaskList()}{" "}
      </div>
    );
  }
}

export default withRouter(MyTask);
