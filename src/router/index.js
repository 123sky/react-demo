import React from 'react'
import { HashRouter, Route, Switch} from 'react-router-dom'
import App from '../pages/App/App'
import Login from '../pages/login'
import Main from '../pages/main'


export default class ERouter extends React.Component{

  render(){
    return (
      <HashRouter>
        <App>
          <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/" component={Main}/>
          </Switch>
        </App>
      </HashRouter>
    );
  }
}