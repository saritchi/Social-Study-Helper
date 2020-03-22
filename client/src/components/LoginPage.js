import React, { Component } from 'react'
import { FormGroup, Form,FormInput } from 'shards-react'
import {Link,Redirect} from 'react-router-dom';
import * as withAlert from "./ComponentWithAlert";
import User from '../User.js';
import './Loginpage.css';
import axios from "axios";
 class LoginPage extends Component {

    constructor(props){
        super(props);
        this.state = {user: new User()};
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);       
    }

    onChange(e) {
        const newUser = new User().copy(this.state.user);
        newUser[e.target.name] = e.target.value;
        this.setState({user: newUser});
      }
    
    async onSubmit(e) {
        e.preventDefault();
        try {
            //TODO: check values
            const response = await axios.post('/api/auth', this.state.user);
            let currentUser = new User().copy(response.data);
            this.props.setUser(currentUser);
            this.setState({user: currentUser}, () => {
                if (!this.state.user.isAuthenticated) {
                    this.props.showAlert(withAlert.errorTheme, "Invalid email or password. Please try again");
                 }
            })
        } catch(error) {
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
                <h1 id="header">Welcome To Social Study Helper</h1>
                <nav id="loginnav">
                    <Link id="link"to="/register">SignUp</Link>
                </nav>
                <Form  id="loginform" onSubmit = {this.onSubmit}>
                    <FormGroup>
                    <label>email: </label>
                    <FormInput type="text" name="email" onChange = {this.onChange}></FormInput>
                    </FormGroup>

                    <FormGroup>
                    <label>Password: </label>
                    <FormInput type="password" name="password" onChange = {this.onChange}></FormInput>
                    </FormGroup>

                    <FormInput type="submit" value="Sign in" id ='SignIn'></FormInput><br></br>
                </Form> 
            </div>
        )
    }
}

export default withAlert.withAlert(LoginPage);