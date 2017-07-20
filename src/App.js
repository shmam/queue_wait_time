import React, { Component } from 'react';
import Login from './login.js'
import Dashboard from './dashboard.js'
import './dashboard.css'


class App extends Component {

  render() {
    return (
      <div className="App">
        {/* <Login /> */}
        <Dashboard />
      </div>
    );
  }
}







export default App;
