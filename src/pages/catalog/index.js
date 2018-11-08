import React, { Component } from "react";
import { withRouter } from "react-router";
import { Collapse, Input, Form } from "antd";
import CenterHeader from "../../components/CenterHeader";
import CatalogItem from "../../components/CatalogItem";
import axios from "../../axios";
import "./index.less";

const Panel = Collapse.Panel;
const FormItem = Form.Item;

class Catalog extends Component {
  setCurrentTask = taskId => {
    this.props.setCurrentTask(taskId);
  };

  handleTaskChange = (type, val) => {
    this.props.handleTaskChange(type, val);
  };

  createCatalog = e => {
    if (e.keyCode !== 13) {
      return;
    }
    axios
      .ajax({
        method: "POST",
        url: "catalog/",
        data: {
          board_id: this.props.match.params.boardId,
          name: e.target.value
        }
      })
      .then(res => {
        let catalogList = this.props.catalogList.unshift(res);
        this.props.form.resetFields();
        this.setState({ catalogList });
      });
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
        let catalogList = this.props.catalogList.map(catalogItem => {
          if (catalogItem.uid === task.catalog.uid) {
            catalogItem.task_list.splice(
              catalogItem.task_list.findIndex(item => item.uid === task.uid),
              1
            );
            return catalogItem;
          } else {
            return catalogItem;
          }
        });
        this.props.form.resetFields();
        this.setState({ catalogList });
      });
  };

  creatTask(catalog, e) {
    if (e.keyCode !== 13) {
      return;
    }
    axios
      .ajax({
        method: "POST",
        url: "task/",
        data: {
          catalog_id: catalog.uid,
          project_id: this.props.match.params.projectId,
          written_content: e.target.value
        }
      })
      .then(res => {
        let catalogList = this.props.catalogList.map(catalogItem => {
          if (catalogItem.uid === catalog.uid) {
            catalogItem.task_list.unshift(res);
            return catalogItem;
          } else {
            return catalogItem;
          }
        });
        this.props.form.resetFields();
        this.setState({ catalogList });
      });
  };

  renderCatalog = () => {
    const { getFieldDecorator } = this.props.form;
    return this.props.catalogList.map((catalog, index) => {
      let task = catalog.task_list.map(task => {
        // TODO 后台是否应该直接返回status为1的数据
        if(task.status === 0){
          return ''
        }
        return (
          <CatalogItem
            key={task.uid}
            data={{ task, pathParams: this.props.match.params }}
            setCurrentTask={taskId => {
              this.setCurrentTask(taskId);
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
          />
        );
      });
      return (
        <Panel header={catalog.name} key={index + ""}>
          <Form className="create-wrap">
            <FormItem>
              {getFieldDecorator("taskContent", {})(
                <Input
                  placeholder={`添加任务至"${catalog.name}"，回车即可保存`}
                  onKeyDown={this.creatTask.bind(this, catalog)}
                />
              )}
            </FormItem>
          </Form>
          {task}
        </Panel>
      );
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="catalog">
        <CenterHeader board={this.props.board} />
        <Form className="create-catalog-wrap">
          <FormItem>
            {getFieldDecorator("catalogName", {})(
              <Input
                onKeyDown={this.createCatalog}
                placeholder="新建任务清单，回车即可保存"
              />
            )}
          </FormItem>
        </Form>
        <div className="collapse-wrap">
          <Collapse defaultActiveKey={["0"]}>{this.renderCatalog()}</Collapse>
        </div>
      </div>
    );
  }
}

export default withRouter(Form.create()(Catalog));
