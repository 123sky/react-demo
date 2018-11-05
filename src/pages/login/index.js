import React, { Component } from "react";
import "./index.less";
import axios from "../../axios";

class Login extends Component {
  state = {
    QRCode: null
  };

  componentDidMount() {
    this.getQRCode();
  }

  getQRCode = () => {
    axios
      .getFile({
        url: "login/wechat/"
      })
      .then(res => {
        this.setState({
          QRCode: "data:image/png;base64," + decodeURI(res.data),
          sessionId: res.headers.sessionid
        });
        let timer = setInterval(() => {
          let data = {
            session_id: this.state.sessionId
          };
          axios
            .getFile({
              method: "POST",
              url: "login/wechat/",
              data
            })
            .then(res => {
              console.log(res);
              if (res.data.code === 0) {
                console.log(timer)
                clearInterval(timer);
                sessionStorage.setItem('user', JSON.stringify(res.data.data))
                console.log("登陆成功");
                this.props.history.push(`/task`)
              }
            });
        }, 1000);
      });
  };
  render() {
    return (
      <div className="login">
        <div className="login-box">
          <h2>微信扫码登陆</h2>
          <img src={this.state.QRCode} alt="二维码" />
        </div>
      </div>
    );
  }
}

export default Login;
