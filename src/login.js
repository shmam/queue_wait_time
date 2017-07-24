import React, { Component } from 'react';
import './App.css';
import logo from './icon.png';

/**
 * Title
 * Doctor dropdown 
 * type in last name -> convert to lower case -> check db 
 * button that makes the ajax call
 * Store their data and the time logged in into the session storage.
 */

class Login extends Component {

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo"/> {/*Optum Logo */}
          <h2>OPTUMISTICS</h2>
          
          
        </div> {/* end of App-header */}

        <div className="App-body">
          <Dropdown/>
          <Textbox/>
          <button className="submit-button">  SUBMIT </button>
        </div> {/* end of App-header div */}
      </div> // end of App div
    );
  }
}


class Dropdown extends Component {
  constructor() {
    super();
    this.state = {

    }
  }
  render() {
    return (
      <div className="dropdown">
        <button className='dropbtn'>CLINIC</button>
          <div className="dropdown-content">
            <a href="#"><b>UNC RESARCH HOSPITAL</b></a>
            <a href="#"><b>DUKE MEDICAL FACILITY</b></a>
            <a href="#"><b>VT BOJANGLE CENTER</b></a>
          </div> {/* end of dropdown content */}
      </div> // end of dropdown div
    );
  }
}

class Textbox extends Component {
  constructor() {
    super();
    this.state = {

    }
  }
  render() {
    return (
      <form className="form"><strong>
        PATIENT ID:</strong><br/><input className="patient_id" type="text" placeholder="Patient ID #" name="PatientID"/><br/>
      </form> // end of form
    );
  }
}







export default Login;
