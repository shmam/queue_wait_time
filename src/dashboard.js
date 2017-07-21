import React, { Component } from 'react';
import './App.css';
import './animate.css'
import Login from './login.js'

const url = 'http://applicationdashboard.us-east-1.elasticbeanstalk.com/';

class Dashboard extends Component {

  
  constructor(props){
      super(props);
      this.state = {
          today: false,
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
      }
  }

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
  

  todayStats(){
      console.log("hello")
      if(this.state.today){
          return(
              <div>
              <QueuePosition provider_id={this.state.information[0].provider_id}/>
              <CurrentWaitTime apptTime={this.state.information[0].display_start_time} provider_id={this.state.information[0].provider_id} expected_start_time={this.state.information[0].expected_start_time} />
              <button onClick={() => this.buttonReload()}>refresh</button>
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
          if(parseInt(data[0].expected_start_time.substring(0,2)) > 12){
              var x = parseInt(data[0].expected_start_time.substring(0,2)) - 12
              x = (String(x) + data[0].expected_start_time.substring(2,5) + "pm")
              data[0].display_start_time = x;
          }
          else{
              data[0].display_start_time = data[0].expected_start_time.substring(0,5) + 'am'
          }
          this.setState({information:data});
          
          
      })
  }

  buttonReload(){
      var dataObj = null; 
      fetch(url + 'queue/present/appointment_information/1160')
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



  render() {
    console.log(this.state.information[0])
    return (
      <div className="Dashboard">
        <h1 className="animated fadeIn">Hey, {this.state.information[0].patient_first_name}!</h1>
        <AppointmentInfo name={this.state.information[0].patient_first_name + " "+ this.state.information[0].patient_last_name } time={this.state.information[0].display_start_time} doctor={this.state.information[0].provider_first_name + " "+ this.state.information[0].provider_last_name} date={this.date(this.state.information[0].appointment_date.substring(0,10))}/>
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

class QueuePosition extends Component{
    constructor(props){
        super(props);
        this.state = {
            queuePos: "...",
        }
    }

    componentDidMount(){
        var today= new Date();
        today= today.toISOString().substring(0,10);
        fetch(url + 'queue/present/queue_position/'+today+'/' + String(this.props.provider_id))

        .then((resp) => resp.json())
        .then(data => {
            
            this.setState({queuePos:(data.length+1)})
        })
    }

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

class CurrentWaitTime extends Component{
    constructor(props){
        super(props);
        this.state={
            waittime: '...', 
            finalTime: 'loading',
        }
    }

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

    finalTime(){
        
    }

    render(){
        var minutes;
        var hours;
        var leftover=0;
        var finalTime;
        var ampm;

        minutes=parseInt((this.props.apptTime).substring(3,5));
        hours= parseInt((this.props.apptTime).substring(0,2));
        ampm=(this.props.apptTime).substring(5,7);
        var sum= minutes+ this.state.waittime;
        if(sum>60){
            leftover=sum-60;
            hours++;
            minutes=leftover;
        }
        else if(sum>120){
            leftover=sum-120;
            hours+=2;
            minutes=leftover;
        }else{
            minutes=sum;
        }

        if(hours>12){
            hours=hours-12;
            ampm="pm";
        }
        finalTime= String(hours)+":"+String(minutes)+ampm
        
        return(
            <div className="CurrentWaitTime animated fadeInLeft">
                <table>
                    <tr>
                        <th>Adjusted Start Time</th>
                        
                    </tr>
                    <tr>
                        <td><strong>{finalTime}</strong> </td>
                        
                    </tr>
                    <tr>
                        
                    </tr>

                </table>
            </div>
        );
    }
}




export default Dashboard;
