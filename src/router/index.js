import React from 'react'
import { HashRouter, Route, Switch} from 'react-router-dom'
import App from '../pages/App/App'
import Login from '../pages/login'
import Main from '../pages/main'
import Catelog from '../pages/catelog'
import Deitail from '../pages/deitail'

export default class ERouter extends React.Component{

  render(){
    return (
      <HashRouter>
        <App>
          <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/" render={()=>
              <Switch>
                <Main 
                  centerArea = {
                    <div>
                      <Route path='/project/:projectId/board/:boardId' component={Catelog} />
                    </div>
                  }
                  rightArea = {
                    <div>
                      <Route exact path='/project/:projectId/board/:catelogId/task/:taskId' component={Deitail} />
                    </div>
                  }
                />
              </Switch>
            } />
          </Switch>
        </App>
      </HashRouter>
    );
  }
}