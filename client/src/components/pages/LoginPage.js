import React, { Component } from 'react'
import { Button, Card, FormGroup, Form,FormInput, CardHeader } from 'shards-react'
import {Link,Redirect} from 'react-router-dom';
import * as withAlert from "../HOC/ComponentWithAlert";
import User from '../../User.js';
import './Loginpage.css';
import GoogleLogin from 'react-google-login';
import axios from "axios";
 class LoginPage extends Component {
    constructor(props){
        super(props);
        this.state = {user: new User()};
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this); 
    }
    
    responseGoogle = async response => {
        console.log(response);
        if (response.error) {
            this.props.showAlert(withAlert.errorTheme, "Unable to login with Google. Please try again later.");
            return;
        }

        var fname=response.getBasicProfile().getGivenName();
        var lname=response.getBasicProfile().getFamilyName()
        var email =response.getBasicProfile().getEmail();
        var password='';
        var role='student';
        var isAuthenticated = true;
        const user = new User(email,password,fname,lname,role,isAuthenticated);
        try {
            await axios.post('/api/google/register', user);
            this.props.setUser(user);
            this.setState({user: user});
        } catch (error) {
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }

    }
    onChange(e) {
        const newUser = new User().copy(this.state.user);
        newUser[e.target.name] = e.target.value;
        this.setState({user: newUser});
      }
    
    async onSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth', this.state.user);
            let currentUser = new User().copy(response.data);
            console.log(currentUser);
            this.props.setUser(currentUser);
            this.setState({user: currentUser}, () => {
                if (!this.state.user.isAuthenticated) {
                    this.props.showAlert(withAlert.errorTheme, "Invalid email or password. Please try again");
                 }
            })
        } catch(error) {
            console.log(error);
            this.props.showAlert(withAlert.errorTheme, error.response.data.result);
        }
    }
    
    render() {
        if(this.state.user.isAuthenticated){
            return(
                <div>
                    {<Redirect to='/home'/>}
                </div>
            )
        }
        return (
            <div>
                <br></br>
                <h1 id="header">Social Study Helper</h1>

                <Card id="login-card">
                    <CardHeader>Sign in</CardHeader>
                    <Form  id="loginform" onSubmit = {this.onSubmit}>
                        <FormGroup>
                        <label id="login-text">Email </label>
                        <FormInput type="text" name="email" onChange = {this.onChange}></FormInput>
                        </FormGroup>

                        <FormGroup>
                        <label id="login-text">Password </label>
                        <FormInput type="password" name="password" onChange = {this.onChange}></FormInput>
                        </FormGroup>

                        <Button type="submit" id="button-signin" theme="info" size="lg" block>Sign In</Button><br></br>
                    </Form> 
                    <div id="google-signin">
                        <GoogleLogin
                            
                            clientId="450582683465-sa51lvh1nc8hcm86unoscffs8gcm8tsi.apps.googleusercontent.com"
                            buttonText="Login with Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>

                    <div id="sign-up">
                        <h6>Don't have an account? <Link id="link"to="/register">Sign up here</Link> </h6>
                    </div>
                </Card>

            </div>
        )
    }
}

export default withAlert.withAlert(LoginPage);