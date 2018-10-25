import React, { Component } from 'react';
import { Collapse } from 'antd';
import CenterHeader from './CenterHeader'
import CatelogItem from './CatelogItem'
import axios from '../../axios';
import './index.less';

const Panel = Collapse.Panel;

class Catelog extends Component {

  state = {
    catelogList: []
  };

  componentDidMount () {
    this.getCatelog(this.props.match.params.boardId)
  }

  componentWillReceiveProps(props) {
    this.getCatelog(props.match.params.boardId)
  }

  getCatelog = async (uid) => {
    let res = await axios.ajax({ url: `catalog/list?board_id=${uid}`})
    
    this.setState ({
      catelogList: res.data
    }) 
  }

  renderCatelog = () => {
    return this.state.catelogList.map((catelog, index) => {
      let task = catelog.task_list.map(task => {
        return (
          <CatelogItem key={task.uid} data={{task, pathParams: this.props.match.params}}></CatelogItem>
        )
      })
      return (
        <Panel header={catelog.name} key={index+''}>
          {task}
        </Panel>
      )
    })
  }

  render() {
    return (
      <div className="catelog">
        <CenterHeader></CenterHeader>
        <div className="collapse-wrap">
          <Collapse defaultActiveKey={['0']}>
            {this.renderCatelog()}
          </Collapse>
        </div>
      </div>
    );
  }
}

export default Catelog;
