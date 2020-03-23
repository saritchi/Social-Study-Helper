import React, {Component} from 'react'
import { withRouter } from 'react-router-dom';
import './Menu.css'
import { slide as Menu } from "react-burger-menu";
import User from '../../User'
import axios from 'axios';

export default (WrappedComponent) => {
    class WithMenu extends Component {

        render() {
            return (
                <div>
                    <Menu id="menu">
                        <a id="home" className="menu-item" href="/home">Home</a>
                        <a id="home" className="menu-item" onClick={this.allCoursesView} href="/allCourses">All Courses</a>
                        <a id="home" className="menu-item" onClick={this.logout} href="/">Logout</a>
                    </Menu>
                    <WrappedComponent {...this.props}/>
                </div>
            );
        }
        
        allCoursesView = (event) => {
            event.preventDefault();
            this.props.history.push({
                pathname: '/allCourses',
                state: { email: this.props.user.email }
            });
        }

        logout = async (event) => {
            event.preventDefault();
            await axios.get('/api/logout');
            this.props.setUser(new User());
            this.props.history.push("/")
        }
    }

    return withRouter(WithMenu);
};
