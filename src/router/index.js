import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import App from '../pages/App/App'
import Login from '../pages/login'
import Main from '../pages/main'
import zhCN from 'antd/lib/locale-provider/zh_CN';


export default class ERouter extends React.Component{

  render(){
    return (
      <HashRouter>
        <LocaleProvider locale={zhCN}>
          <App>
            <Switch>
              <Route path="/login" component={Login}/>
              <Route path="/" component={Main}/>
            </Switch>
          </App>
        </LocaleProvider>
      </HashRouter>
    );
  }
}