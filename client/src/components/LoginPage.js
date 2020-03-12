import React, { Component } from 'react'
import {Link,Redirect} from 'react-router-dom';
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
    
    onSubmit(e) {
    e.preventDefault();
    const user = {
        username: this.state.username,
        password: this.state.password
    };

    axios.post('/api/auth',user).then(
        response =>{
            const user = {
                username: response.data[0].username,
                password: response.data[0].password,
                fname: response.data[0].fname,
                lname: response.data[0].fname,
                auth: response.data[0].auth
            };
            console.log(user);
            this.setState(user);
        }
    ).then(()=>{
        console.log(this.state);
    });
    }
    
    render() {
        if(this.state.auth == 'true'){
            return(
                <div>
                    {<Redirect to='/home'/>}
                </div>
            )
        }
        return (
            <div id ='mainbody'>
                <h1 id = 'header' >Welcome To Social Study Helper</h1>
                <nav id="nav">
                    <Link to="/home">SignUp</Link>
                </nav>
                <form  onSubmit = {this.onSubmit}>
                    <label>Username: </label>
                    <input type="text" name="username" onChange = {this.onChange}></input><br></br><br></br>
                    <label>Password: </label>
                    <input type="password" name="password" onChange = {this.onChange}></input><br></br><br></br>
                    <input type="submit" value="Sign in" id ='SignIn'></input><br></br>
                </form> 
            </div>
        )
    }
}

export default LoginPage;