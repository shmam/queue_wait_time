/**
 * Importing necessary components, modules, and style files 
 */

import React, { Component } from 'react';
import './App.css';
import logo from './icon.png';
import Dashboard from './dashboard.js'
import './dashboard.css'

/**
 * Login component used to take in the patient ID, veryfy a user and then pass the necessary informaiton 
 * onto the dasboard component
 */
class Login extends Component {

  /**
   * This constructor instanceates the props, and sets blank values for the state
   * that will be later updated with the fetch call 
   */
  constructor(props){
    super(props);
    this.state = {
      display: 'login',
      value: '',
    }

    /**
     * Creating variables that are binded to functions that can later be used throught the component 
     */
    this.controller=this.controller.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Triggered when the value of the input tag is changed, and triggers a state 
   * change that would record this newly changed value 
   * 
   * @param {*} event 
   */
  handleChange(event) 
  {
    var val = event.target.value;
    this.setState({value: val});
    this.handleSubmit(val);
  }

  /**
   * This is triggered when the form is submitted 
   * 
   * @param {*} value 
   */
  handleSubmit(value) {
    this.setState({value:value});
  }


  /**
   * This monitors the state of the component and then displays elements 
   * based on what the state value is. 
   */
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
                
                <button className="submit-button" id = "dp" type="submit" value="Submit"onClick={() => {
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

/**
 * The dropdown component is for the user to select what hospital that they want to log into
 */
class Dropdown extends Component {
  constructor() {
    super();
    this.state = {
        childVisible: false
    }
  }
    
  render() {
    return (
      <div className="">
          <select>
            <option href="#" ><b>UNC RESARCH HOSPITAL</b></option>
            <option href="#" ><b>DUKE MEDICAL FACILITY</b></option>
            <option href="#" ><b>VT BOJANGLE CENTER</b></option>
          </select> 
      </div> 
    );
  }
 

}









export default Login;
