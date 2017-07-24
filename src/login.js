import React, { Component } from 'react';
import './App.css';
import logo from './icon.png';
import Dashboard from './dashboard.js'
import './dashboard.css'

/**
 * Title
 * Doctor dropdown 
 * type in last name -> convert to lower case -> check db 
 * button that makes the ajax call
 * Store their data and the time logged in into the session storage.
 */

class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
      display: 'login',
      value: '',
    }
    this.controller=this.controller.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(event) {
    var val = event.target.value;
    this.setState({value: val});
    this.handleSubmit(val);
    
  }

  handleSubmit(value) {
    this.setState({value:value});
    
    

  }

  controller(){
    if(this.state.display === 'login'){
      return(<div className="App">
              <div className="App-header">
                <img src={logo} className="App-logo" alt="logo"/> {/*Optum Logo */}
                <h2>OPTUMISTICS</h2>
                
                
              </div> {/* end of App-header */}

              <div className="App-body">
                <Dropdown/>
                <form className="form" onSubmit={this.handleSubmit}><strong>
                  PATIENT ID:</strong><br/><input className="patient_id" type="text" placeholder="####" value={this.state.value} onChange={this.handleChange} name="PatientID"/><br/>
                
                <button className="submit-button" type="submit" value="Submit"onClick={() => {
                  this.setState({display:"dash"});
                  }}>  SUBMIT </button>
                </form> 
              </div> {/* end of App-header div */}
      </div> // end of App div
      );
    }
    else if(this.state.display === 'dash'){
      return(
        <Dashboard patient_id={this.state.value}/>
      );

    }
  }

  render() {
    return (
      this.controller()
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









export default Login;
