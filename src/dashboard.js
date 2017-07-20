import React, { Component } from 'react';
import './App.css';
import Login from './login.js'

const url = 'http://applicationdashboard.us-east-1.elasticbeanstalk.com/';

class Dashboard extends Component {

  
  constructor(props){
      super(props);
      this.state = {
          today: false,
          information:[{
              expected_start_time: '',
              patient_first_name: '',
              patient_last_name: '',
              appointment_date: '',
              provider_first_name: '',
              provider_last_name: '',
          }],
      }
  }

  date(date){
      var today= new Date();
      today= today.toISOString().substring(0,10);

       //callback data
      if(date===today){
          date="today"
          this.state.today = true;
      }
      else{
          date= "on "+ parseInt(date.substring(5,7))+"/"+ parseInt(date.substring(8,11))+"/"+date.substring(0,4);
      }
      return date;
  }
  

  todayStats(){
      console.log("hello")
      if(this.state.today){
          return(
              <div>
              <QueuePosition />
              <CurrentWaitTime />
              </div>
          );
      }
      else{
          return(<p>Check back on your appointment day to see stats!</p>);
      }
  }

  componentDidMount(){
      var dataObj = null; 
      fetch(url + 'queue/present/appointment_information/1160')
      .then((resp) => resp.json())
      .then(data => {
          
          dataObj = data[0];
          this.setState({information:data});
      })
  }



  render() {
    console.log(this.state.information[0])
    return (
      <div className="Dashboard">
        <h1>Hey, {this.state.information[0].patient_first_name}!</h1>
        <AppointmentInfo name={this.state.information[0].patient_first_name + " "+ this.state.information[0].patient_last_name } time={this.state.information[0].expected_start_time.substring(0,5)} doctor={this.state.information[0].provider_first_name + " "+ this.state.information[0].provider_last_name} date={this.date(this.state.information[0].appointment_date.substring(0,10))}/>
        {this.todayStats()}

      </div>
    );
  }
}



class AppointmentInfo extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="AppointmentInfo">
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

class QueuePosition extends Component{
    render(){
        return(
            <div className="QueuePosition">
                <table>
                    <tr>
                        <th>Queue Position: </th>
                        <td>2nd</td>
                    </tr>

                </table>
            </div>
        );
    }


}

class CurrentWaitTime extends Component{
    render(){
        return(
            <div className="CurrentWaitTime">
                <table>
                    <tr>
                        <th>Current Wait Time</th>
                        
                    </tr>
                    <tr>
                        <td>11:30am + <strong>15min</strong> </td>
                        
                    </tr>
                    <tr>
                        <button>refresh</button>
                    </tr>

                </table>
            </div>
        );
    }
}




export default Dashboard;
