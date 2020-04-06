import React, { Component } from 'react'
import {Link,Redirect} from 'react-router-dom';
import { Button, Card, Form,FormGroup,FormInput, CardHeader, FormCheckbox} from "shards-react";
import './Register.css'
import * as withAlert from "../HOC/ComponentWithAlert";
import axios from "axios";

 class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            fname:'',
            lname:'',
            role:'',
            registered: false
        };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.userType = this.userType.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }

    userType(e,role){
        this.setState({role:role});

    }
    
   async onSubmit(e) {
        e.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password,
            fname: this.state.fname,
            lname: this.state.lname,
            role: this.state.role
        };
        try {
            await axios.post('/api/register', user);
            this.setState({registered: true});
        } catch (error) {
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }
    }
    render() {
        const isTeacher = this.state.role === 'teacher' ? true : false;
        const isStudent = this.state.role === 'student' ? true : false;
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
                <h1 id="header">Social Study Helper</h1>
                <Card id="register-card">
                    <CardHeader>Sign Up</CardHeader>
                    <Form id='register-form' onSubmit = {this.onSubmit}>
                        <FormGroup>
                        <label id="signup-text">Email </label>
                        <FormInput type="email" name="email" onChange = {this.onChange}></FormInput>
                        </FormGroup>

                        <FormGroup>
                        <label id="signup-text">Password </label>
                        <FormInput type="password" name="password" onChange = {this.onChange}></FormInput>
                        </FormGroup>

                        <FormGroup>
                        <label id="signup-text">First Name </label>
                        <FormInput type="text" name="fname" onChange = {this.onChange}></FormInput>
                        </FormGroup>

                        <FormGroup>
                        <label id="signup-text">Last Name </label>
                        <FormInput type="text" name="lname" onChange = {this.onChange}></FormInput>
                        </FormGroup>

                        <label id="role-picker">User Type </label>
                        <br/>
                        <div id="role-checkbox">
                            <FormCheckbox className="role" checked={isTeacher} onChange={e => this.userType(e, "teacher")}>Teacher</FormCheckbox>
                            <FormCheckbox className="role" checked={isStudent} onChange={e => this.userType(e, "student")}>Student</FormCheckbox>
                        </div>
                        <Button type="submit" id="button-signup" theme="info" size="lg" block>Sign Up</Button>
                    </Form> 
                    <div id="back-login">
                        <Link id='link' to ="/" >Back To Login</Link>
                    </div>
                    
                </Card>

            </div>
        )
    }
}

export default withAlert.withAlert(Register);