import React, { Component } from 'react'
import { connect } from 'react-redux';
import { logIn } from '../actions/logInActions';
import Student from './Student';
import Teacher from './Teacher';
import {Link} from 'react-router-dom';
 class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            username:'',
            password:'',
            type:'0'
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }
    
    onSubmit(e) {
    e.preventDefault();
    var type = document.getElementsByClassName("myradio");
    if(type[0].checked == true){type = type[0].value;}
    else if (type[1].checked == true){type = type[1].value;}
    else{type = 0;}
    this.state.type = type;
    const user = {
        username: this.state.username,
        password: this.state.password,
        type: this.state.type
    };
    this.props.logIn(user);

    //Was Thinking about prompting an alert window if authentication being failed but as told by bobby it runs the next line 
    //before this.props.logIn(user) I trid await but did not worked we need to fix this

    /*await this.props.logIn(user);
    var arr = Object.values(this.props.user);
    console.log(arr);
    if(arr.length>0){
        if(arr[0].auth == 'false'){
            alert("You are not a valid user please sign up");
        }
        
    }*/
    
    }

    render() {

        var arr = Object.values(this.props.user);
        if(arr.length>0){
            if(arr[0].auth == 'true'){
                if(arr[0].type == '1'){
                    return(
                        <div><Student/></div>
                    )
                }
                else{
                    return(
                        <div><Teacher/></div>
                    )
                }

            }
           
        }
        return (
            <div>
                <div>
                <h1>I am home</h1>
                <form onSubmit = {this.onSubmit}>
                    <label>Username</label>
                    <input type="text" name="username" onChange = {this.onChange}></input><br></br>
                    <label>Password</label>
                    <input type="password" name="password" onChange = {this.onChange}></input><br></br><br></br>
                    <div>
                        <label>User type:</label><br></br>
                        <input className = "myradio" type="radio" name="type" value = "1" /><label>Student</label><br></br>
                        <input className = "myradio" type="radio" name="type" value = "2"/><label>Teacher</label>
                    </div>
                    <input type="submit" value="submit"></input><br></br>
                </form> 
                </div>
                <div>
                    <Link to="/signUp">SignUp</Link>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user.item
  });
  
export default connect(mapStateToProps, { logIn })(Home);
