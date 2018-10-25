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
                      <Route exact path='/task' component={Catelog} />
                      <Route path='/task/:id' component={Catelog} />
                    </div>
                  }
                  rightArea = {
                    <div>
                      <Route exact path='/task/:catelogId/detail/:taskId' component={Deitail} />
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