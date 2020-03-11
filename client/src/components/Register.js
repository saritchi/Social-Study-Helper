import React, { Component } from 'react'
import {  Link } from 'react-router-dom';
import axios from "axios";
 class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            username:'',
            password:'',
            fname:'',
            lname:''
        };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }
    
    onSubmit(e) {
    e.preventDefault();
    const user = {
        username: this.state.username,
        password: this.state.password,
        fname: this.state.fname,
        lname: this.state.lname
    };
   axios.post('/api/register',user);
    alert("Succesfully Registered");
    
    }
    render() {
        return (
            <div>
                <h1 >Registering User</h1>
                <nav id="nav">
                    <Link to ="/" >Go Home Page</Link>
                </nav>
                <form onSubmit = {this.onSubmit}>
                    <label>Username: </label>
                    <input type="text" name="username" onChange = {this.onChange}></input><br></br>
                    <label>Password: </label>
                    <input type="password" name="password" onChange = {this.onChange}></input><br></br>
                    <label>First Name: </label>
                    <input type="text" name="fname" onChange = {this.onChange}></input><br></br>
                    <label>Last name: </label>
                    <input type="text" name="lname" onChange = {this.onChange}></input><br></br><br></br>
                    <input type="submit" value="SignUp"></input>
                </form> 
            </div>
        )
    }
}

export default Register;