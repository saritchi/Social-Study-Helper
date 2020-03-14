import React, { Component } from 'react'
import {Link,Redirect} from 'react-router-dom';
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
            lname:'',
            registered: false
        };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }
    
   async onSubmit(e) {
        e.preventDefault();
        //TODO: error check contents
        const user = {
            email: this.state.email,
            password: this.state.password,
            name: this.state.fname + ' ' + this.state.lname
        };
        try {
            //TODO: get a user object back from the server
            const response = await axios.post('/api/register', user);
            this.setState({registered: true});
        } catch (error) {
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }
    }
    render() {
        //TODO: redirect to home after value registration
        if (this.state.registered) {
            return(
                <div>
                    {<Redirect to='/'/>}
                </div>
            )
        }
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
                    <FormInput type="email" name="email" onChange = {this.onChange}></FormInput>
                    </FormGroup>

                    <FormGroup>
                    <label>Password: </label>
                    <FormInput type="password" name="password" onChange = {this.onChange}></FormInput>
                    </FormGroup>

                    <FormGroup>
                    <label>First Name: </label>
                    <FormInput type="text" name="fname" onChange = {this.onChange}></FormInput>
                    </FormGroup>

                    <FormGroup>
                    <label>Last name: </label>
                    <FormInput type="text" name="lname" onChange = {this.onChange}></FormInput>
                    </FormGroup>

                    <FormInput type="submit" value="SignUp"></FormInput>
                </Form> 
            </div>
        )
    }
}

export default withAlert.withAlert(Register);