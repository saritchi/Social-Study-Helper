import React, { Component } from 'react'
import {  Link } from 'react-router-dom';
import { Form,FormGroup,FormInput} from "shards-react";
import './Register.css'
import * as withAlert from "./ComponentWithAlert";
import axios from "axios";
 class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:'',
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
    
   async onSubmit(e) {
    e.preventDefault();
    const user = {
        email: this.state.email,
        password: this.state.password,
        fname: this.state.fname,
        lname: this.state.lname
    };
    try {
        const response = await axios.post('/api/register', user);
        alert(` Response status ${response.status} Congratulation ${response.data.result}`);
    } catch (error) {
        this.props.showAlert(withAlert.errorTheme, error.response.data.result);
    }
    
    }
    render() {
        return (
            <div>
                <br></br>
                <h1 id="header">Registering User</h1>
                <nav id="nav">
                    <Link id='link' to ="/" >Go Home Page</Link>
                </nav>
                <Form id='form' onSubmit = {this.onSubmit}>
                    <FormGroup>
                    <label>email: </label>
                    <FormInput type="email" name="email" onChange = {this.onChange}></FormInput><br></br>
                    </FormGroup>

                    <FormGroup>
                    <label>Password: </label>
                    <FormInput type="password" name="password" onChange = {this.onChange}></FormInput><br></br>
                    </FormGroup>

                    <FormGroup>
                    <label>First Name: </label>
                    <FormInput type="text" name="fname" onChange = {this.onChange}></FormInput><br></br>
                    </FormGroup>

                    <FormGroup>
                    <label>Last name: </label>
                    <FormInput type="text" name="lname" onChange = {this.onChange}></FormInput><br></br><br></br>
                    </FormGroup>

                    <FormInput type="submit" value="SignUp"></FormInput>
                </Form> 
            </div>
        )
    }
}

export default withAlert.withAlert(Register);