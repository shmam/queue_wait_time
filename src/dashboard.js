/**
 * Importing components, react, and the CSS files. 
 */

import React, { Component } from 'react';
import './App.css';
import './animate.css'

// URL TO MAKE THE API CALLS
const url = 'http://applicationdashboard.us-east-1.elasticbeanstalk.com/';


/**
 * This is the main component that loads after the login. It allows the user to read their start times, 
 * and appointment information, and sign up for text alerts
 */
class Dashboard extends Component {

  /**
   * This constructor creates a blank state JSON object that will be passed back 
   * with the fetch GET call. 
   * 
   * @param {*} props 
   */
  constructor(props){
      super(props);
      this.state = {
          today: false,
          pID: this.props.patient_id,
          information:[{
              expected_start_time: '',
              display_start_time: '',
              patient_first_name: '',
              patient_last_name: '',
              appointment_date: '',
              provider_first_name: '',
              provider_last_name: '',
              provider_id: '',
              appointment_id: '',
          }],
      }
  }

  /**
   * generates a new date for the device render, and checks if the paramter date is equal to today. If true then 
   * the state is set to true. 
   * @param {*} date 
   */
  date(date){
      var today= new Date();
      today= today.toISOString().substring(0,10);
      if(date===today){
          date="today"
          this.state.today = true;
      }
      else{
          date= "on "+ parseInt(date.substring(5,7))+"/"+ parseInt(date.substring(8,11))+"/"+date.substring(0,4);
      }
      return date;
  }
  
  /**
   * This function is called in the render function, and it returns two possible sents of components based on the
   * value of a state element. If the appointment is today, then it returns relevant cards on the infomation, but if 
   * the appointment is not today then it returns a reminder to check back in later. 
   */
  todayStats(){
      console.log("hello")
      if(this.state.today){
          return(
              <div>
              <QueuePosition provider_id={this.state.information[0].provider_id}/>
              <CurrentWaitTime apptTime={this.state.information[0].display_start_time} provider_id={this.state.information[0].provider_id} expected_start_time={this.state.information[0].expected_start_time} />
              <button onClick={() => this.buttonReload()}
              >refresh</button>
              </div>
          );
      }
      else{
          return(<p>Check back on your appointment day to see stats!</p>);
      }
  }

  /**
   * Crucial and necesary function in the react component lifecycle, this function is called after the render 
   * function has been initially called, and this uses fetch to send a GET API request. On success the values are 
   * added to the state using this.setState(), and this causes a rerender with the pulled information.
   * 
   * TODO: add a case for not success, because at the moment the app just breaks for an invalid id that triggers a 404
   */
  componentDidMount(){
      var dataObj = null; 
      fetch(url + 'queue/present/appointment_information/' + this.state.pID, {mode:'cors'})
      .then((resp) => resp.json())
      .then(data => {
          if(parseInt(data[0].expected_start_time.substring(0,2)) > 12){
              var x = parseInt(data[0].expected_start_time.substring(0,2)) - 12
              x = (String(x) + data[0].expected_start_time.substring(2,5) + "pm")
              data[0].display_start_time = x;
          }
          else if(parseInt(data[0].expected_start_time.substring(0,2)) === 12){
              data[0].display_start_time = data[0].expected_start_time.substring(0,5) + 'pm'
          }
          else if(parseInt(data[0].expected_start_time.substring(0,2)) < 12){
              data[0].display_start_time = data[0].expected_start_time.substring(0,5) + 'am'
          }
          this.setState({information:data});
          
          
      })
  }

  /**
   * Simmilar to the componentDidMount function, this wipes the states, renders with no information, fetches 
   * new info, and then re-renders with the drawn information. This is connected to a button on the page. 
   */
  buttonReload(){
      //setting the state to null
      var dataObj = null; 
      this.setState({
          pID: this.props.patient_id,
          information:[{
              expected_start_time: '',
              display_start_time: '',
              patient_first_name: '',
              patient_last_name: '',
              appointment_date: '',
              provider_first_name: '',
              provider_last_name: '',
              provider_id: '',
          }],
      })

      // getting all the appointment information from the API, and setting the information to the state of the component 
      fetch(url + 'queue/present/appointment_information/' + this.state.pID)
      .then((resp) => resp.json())
      .then(data => {
          if(parseInt(data[0].expected_start_time.substring(0,2)) > 12){
              var x = parseInt(data[0].expected_start_time.substring(0,2)) - 12
              x = (String(x) + data[0].expected_start_time.substring(2,5) + "pm")
              data[0].display_start_time = x;
          }
          else{
              data[0].display_start_time = data[0].expected_start_time.substring(0,5) + 'am'
          }
          this.setState({information:data});
          console.log("reload the whole page") 
          
      })
  }


  /**
   * This is called every single time that the state is changed, and returns DOM elements based on parameters and 
   * user constructed components. 
   */
  render() {
    console.log(this.state.information[0])
    return (
      <div className="Dashboard">
        <h1 className="animated fadeIn">Hey, {this.state.information[0].patient_first_name}!</h1>
        <AppointmentInfo name={this.state.information[0].patient_first_name + " "+ this.state.information[0].patient_last_name } time={this.state.information[0].display_start_time} doctor={this.state.information[0].provider_first_name + " "+ this.state.information[0].provider_last_name} date={this.date(this.state.information[0].appointment_date.substring(0,10))}/>
        {this.todayStats()}
        <PhoneRegister patient_id={this.props.patient_id} appointment_id={this.state.information[0].appointment_id}/>

      </div>
    );
  }
}


/**
 * Component that takes in props from the parent and makes a card to convey appointment information 
 * in common language for quick informaiton digest
 */
class AppointmentInfo extends Component{
    //Called to set up the props for render
    constructor(props){
        super(props);
    }
    /**
     * This is called every single time that the state is changed, and returns DOM elements based on parameters and 
     * user constructed components. 
     */
    render(){
        return(
            <div className="AppointmentInfo animated fadeInLeft">
                <table>
                    <tr>
                        <th>Your Appointment</th>
                    </tr>
                    <tr>
                        <p><strong>{this.props.name}</strong>, you have an appointment <strong>{this.props.date}</strong> that is scheduled for <strong>{this.props.time}</strong> with <strong>{this.props.doctor}</strong> </p>
                    </tr>

                </table>
            </div>
        );
    }
}


/**
 * Component that displays the user's queue position, letting them know how far away their appoinment is in terms of other 
 * appointments.
 */
class QueuePosition extends Component{
    /**
     * This constructor creates a blank state JSON object that will be passed back 
     * with the fetch GET call. 
     * 
     * @param {*} props 
     */
    constructor(props){
        super(props);
        this.state = {
            queuePos: "...",
        }
    }
    /**
     * Gets the user's queue position given the provider_id and the current fate
     * 
     * Crucial and necesary function in the react component lifecycle, this function is called after the render 
     * function has been initially called, and this uses fetch to send a GET API request. On success the values are 
     * added to the state using this.setState(), and this causes a rerender with the pulled information.
     * 
     * TODO: add a case for not success, because at the moment the app just breaks for an invalid id that triggers a 404
     */
    componentDidMount(){
        var today= new Date();
        today= today.toISOString().substring(0,10);
        fetch(url + 'queue/present/queue_position/'+today+'/' + String(this.props.provider_id))

        .then((resp) => resp.json())
        .then(data => {
            
            this.setState({queuePos:(data.length+1)})
        })
    }

    /**
     * This is called every single time that the state is changed, and returns DOM elements based on parameters and 
     * user constructed components. 
     */
    render(){
        return(
            <div className="QueuePosition animated fadeInLeft">
                <table>
                    <tr>
                        <th>Queue Position: </th>
                        <td>{this.state.queuePos}</td>
                    </tr>

                </table>
            </div>
        );
    }


}

/**
 * CurrentWaitTime is a component that calculates the adjusted wait time for the user based on the wait time and their 
 * appointment start time. 
 */
class CurrentWaitTime extends Component{

    //Sets the blank JSON object that can be updated with the new state
    constructor(props){
        super(props);
        this.state={
            waittime: '...', 
            finalTime: 'loading',
        }
    }
    /**
     * Gets the wait time from the API using the paramters provider_id and the appointment_expected_start_time and the current date
     * 
     * Crucial and necesary function in the react component lifecycle, this function is called after the render 
     * function has been initially called, and this uses fetch to send a GET API request. On success the values are 
     * added to the state using this.setState(), and this causes a rerender with the pulled information.
     * 
     * TODO: add a case for not success, because at the moment the app just breaks for an invalid id that triggers a 404
     */
    componentDidMount(){
        var today= new Date();
        today= today.toISOString().substring(0,10);
        fetch(url + 'queue/present/wait_time/' + today + '/' + this.props.provider_id + '/' + this.props.expected_start_time)
        .then((resp) => resp.json())
        .then(data => {
            if(data < 0){
                this.setState({waittime: (0 )})
            }
            else{
                this.setState({waittime: (data)})
            }
        })    
    }
  
    /**
     * Very simmilar to componentDidMount, it calls the api and updates the states that then in turn triggers a re-render
     */
    refreshTime(){

        var today= new Date();
        today= today.toISOString().substring(0,10);
        fetch(url + 'queue/present/wait_time/' + today + '/' + this.props.provider_id + '/' + this.props.expected_start_time)
        .then((resp) => resp.json())
        .then(data => {
            if(data < 0){
                this.setState({waittime: (0)})
            }
            else{
                this.setState({waittime: (data)})
            }
        })    
    }


    /**
     * Typical render function besides the fact that newly formatted final time is calculated and accounted for in this render
     * function 
     */
    render(){

        //all the variables are defined here
        var minutes;
        var hours;
        var leftover=0;
        var finalTime;
        var ampm;
        
        // if the time string is formatted with a single digit hour (EX: 3:00pm)
        if(this.props.apptTime.length === 6){
            minutes=parseInt((this.props.apptTime).substring(2,4));
            hours= parseInt((this.props.apptTime).substring(0,1));
            ampm=(this.props.apptTime).substring(4,6);
        }

        //if the time string is formatted with a double digit hour (EX: 11:00am)
        else if(this.props.apptTime.length === 7){
            minutes=parseInt((this.props.apptTime).substring(3,5));
            hours= parseInt((this.props.apptTime).substring(0,2));
            ampm=(this.props.apptTime).substring(5,7);
        }

        // adding the wait time to the appointment time.
        var sum= minutes + this.state.waittime;

        // if the addition of the wait time and the minutes is over one hour
        if(sum>60){
            leftover=sum-60;
            hours++;
            minutes=leftover;
        }

        // if the additon of the wait time and the minutes is over two hours     
        else if(sum>120){
            leftover=sum-120;
            hours+=2;
            minutes=leftover;
        }else{
            minutes=sum;
        }

        // if it is noon
        if(hours === 12){
            ampm="pm";
        }

        //if it is past noon
        else if(hours>12){
            hours=hours-12;
            ampm="pm";
        }

        //if there is the special case for there is no wait time and there is an appoinment on the hour
        if(minutes === "0"){
            finalTime = String(hours)+":00" + ampm
        }

        // formatting the string to simple and easy to read standards
        else{finalTime = String(hours)+":"+String(minutes) + ampm}
        
        
        return(
            <div className="CurrentWaitTime animated fadeInLeft">
                <table>
                    <tr><th>Adjusted Start Time</th></tr>
                    <tr><td><strong>{finalTime}</strong> </td></tr>
                </table>
            </div>
        );
    }
}


/**
 * PhoneRegister is a component that takes in a user phone number and allows them to be able to register for text alerts 
 */
class PhoneRegister extends Component{

    //Sets the blank states for the app, and binds the function so we can use
    constructor(props){
        super(props);
        this.state ={
            numberVal: '',
            display: 'notSent'
        }
        this.handleChange = this.handleChange.bind(this);
    }

    /**
     * This function is called after some verification that would update the database and input a phone number associated with 
     * the record of a patient
     */
    ajaxSendTheNumber(){
        if(this.state.numberVal.length === 10){
            console.log(this.state.numberVal)
            this.setState({
                numberVal: "", 
                display: 'sending'
            })
            console.log(this.props)
            fetch(url + 'queue/update/text_alert/'+String(this.props.appointment_id)+'/'+this.props.patient_id+'/'+this.state.numberVal, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "same-origin"
                }).then(function(response) {
                    
                }, function(error) {
                    
            });
        }



    }

    /**
     * This is called in render() and this function monitors the state value of 'display' to control what component is 
     * displayed, this is basically the function of a router but within react with button clicks. 
     */
    screenControl(){
        if(this.state.display === 'notSent'){
            return(
                <div>
                <label>Sign up for Text Alerts:</label>

                <table>
                    <tr>
                        <th><input  placeholder="000-000-0000" maxLength="10" onChange={this.handleChange} value={this.state.numberVal}/></th>
                        <th><button onClick={() => this.ajaxSendTheNumber()}>submit</button></th>
                    </tr>

                </table>
                </div>);
        }
        else if(this.state.display === 'sending'){
            setTimeout(() => {
                this.setState({display:"sent"})
            },2000)
            return(
                <div className="animated fadeIn">   
                    <p> sending ... </p>
                </div>
            );
        }
        else if(this.state.display === 'sent'){
            return(
                <div className="sent animated bounceIn">   
                    <p> Subscribed! </p>
                </div>
            );
        }
    }

    /**
     * This is called when there is a change in the text area of the input box, and it 
     * updates the value of state to correspond with what is in the box.
     * 
     * @param {*} event 
     */
    handleChange(event){
        this.setState({numberVal: event.target.value})
    }

    /**
     * This is called every single time that the state is changed, and returns DOM elements based on parameters and 
     * user constructed components. 
     */
    render(){
        return(
            <div className="PhoneRegister">   
                {this.screenControl()}
            </div>
        );
    }
}



//Exporting the comp and the child comps to be used in any other file
export default Dashboard;

