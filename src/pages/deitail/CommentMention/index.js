import React, { Component } from "react";
import { Mention, Button, Avatar, Form } from "antd";
import axios from "../../../axios";
import "./index.less";

const Nav = Mention.Nav;
const FormItem = Form.Item;
const { toString, getMentions } = Mention;

class CommentMention extends Component {
  state = {
    loading: false,
    suggestions: []
  };

  onSearchChange = async value => {
    let members = [];
    if (this.props.project.members) {
      members = this.props.project.members || [];
    } else if (this.props.project.uid) {
      let res = await axios.ajax({ url: `project/${this.props.project.uid}/` });
      members = res.members;
    }

    let suggestions = members.map(member => (
      <Nav value={member.name} data={member}>
        <Avatar
          src={member.avatar}
          size="small"
          style={{
            width: 14,
            height: 14,
            marginRight: 8,
            top: -1,
            position: "relative"
          }}
        />
        {member.name}
      </Nav>
    ));
    this.setState({ suggestions });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(
        toString(values.mentionContent),
        getMentions(values.mentionContent)
      );
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="comment-mention">
        <Form layout="horizontal" onSubmit={this.handleSubmit}>
          <div className="form">
            <div className="input">
              <FormItem>
                {getFieldDecorator("mentionContent", {})(
                  <Mention
                    suggestions={this.state.suggestions}
                    onSearchChange={this.onSearchChange}
                    placement="top"
                    placeholder="通过@通知项目成员"
                  />
                )}
              </FormItem>
            </div>
            <div className="btn">
              <FormItem>
                <Button type="primary" htmlType="submit">
                  发 送
                </Button>
              </FormItem>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default Form.create()(CommentMention);
