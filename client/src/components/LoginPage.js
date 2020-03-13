import React, { Component } from 'react'
import { FormGroup, Form,FormInput } from 'shards-react'
import {Link,Redirect} from 'react-router-dom';
import * as withAlert from "./ComponentWithAlert";
import './Loginpage.css';
import axios from "axios";
 class LoginPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            username:'',
            password:'',
            fname:'',
            lname:'',
            auth:''
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);       
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }
    
    async onSubmit(e) {
    e.preventDefault();
    try {
        let user = {
            username: this.state.username,
            password: this.state.password
        };
        const response = await axios.post('/api/auth', user);
        user = response.data[0];
        this.setState(user)
    } catch(error) {
        this.props.showAlert(withAlert.errorTheme, error.response.data.result);
    }
}
    componentDidUpdate() {
        if (this.state.auth === 'false') {
            this.props.showAlert(withAlert.errorTheme, "Invalid username or password. Please try again");
         }
         this.state.auth = '';        
      }
    render() {
        if(this.state.auth === 'true'){
            return(
                <div>
                    {<Redirect to='/home'/>}
                </div>
            )
        }
        return (
            <div>
                <h1>Welcome To Social Study Helper</h1>
                <nav id="loginnav">
                    <Link id="link"to="/home">SignUp</Link>
                </nav>
                <Form  id="loginform" onSubmit = {this.onSubmit}>
                    <FormGroup>
                    <label>Username: </label>
                    <FormInput type="text" name="username" onChange = {this.onChange}></FormInput>
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