import React, { Component } from 'react';
import NavLeft from '../../components/NavLeft';
import CenterArea from '../../components/CenterArea';
import RightArea from '../../components/RightArea';
import './App.less';

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="left">
          <NavLeft></NavLeft>
        </div>
        <div className="center">
          <CenterArea></CenterArea>
        </div>
        <div className="right">
          <RightArea></RightArea>
        </div>
      </div>
    );
  }
}

export default App;
