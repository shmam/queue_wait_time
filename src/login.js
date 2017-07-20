import React, { Component } from 'react';
import './App.css';

/**
 * Title
 * Doctor dropdown 
 * type in last name -> convert to lower case -> check db 
 * button that makes the ajax call
 * Store their data and the time logged in into the session storage.
 */

class Login extends Component {

  ajaxREquest(){
    console.log("login")
  }
  
  render() {
    return (
      <div className="Login">
        <h1>Login here my guy, honest.</h1>
        <select>
            <option value="null">Select a Doctor</option>
        </select>
        <br/>
        <button onClick={() => this.ajaxREquest()}> Login </button> 
      </div>
    );
  }
}







export default Login;
