import React, { Component } from 'react';
import { Mention, Button} from 'antd'
import './index.less';

const users = ['afc163', 'benjycui', 'yiminghe', 'jljsj33', 'dqaria', 'RaoHai'];

class CommentMention extends Component {

  state = {
    loading: false,
    suggestions: []
  }

  fetchSuggestions = (value, callback) => {
    setTimeout(() => {
      callback(users.filter(item => item.indexOf(value) !== -1));
    }, 500);
  }

  onSearchChange = (value) => {
    this.fetchSuggestions(value, (suggestions) => {
      this.setState({
        suggestions,
        loading: false,
      });
    });
    this.setState({
      loading: true,
    });
  }

  render () {
    return (
      <div className="comment-mention">
        <div className="mention-wrap">
          <Mention
            loading={this.state.loading}
            suggestions={this.state.suggestions}
            onSearchChange={this.onSearchChange}
            placement="top"
          />
        </div>
        <Button type="primary">发送</Button>
      </div>
    )
  }
}

export default CommentMention;