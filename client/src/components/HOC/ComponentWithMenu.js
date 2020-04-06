import React, {Component} from 'react'
import { withRouter } from 'react-router-dom';
import './Menu.css'
import { slide as Menu } from "react-burger-menu";
import User from '../../User'
import axios from 'axios';

export default (WrappedComponent) => {
    class WithMenu extends Component {
        render() {
            const isTeacher = this.props.user.role === 'teacher' ? true : false;
            return (
                <div>
                    <Menu id="menu" onStateChange={this.toggleMenu}>
                        <a className="menu-item" href="/home">Home</a>
                        <a className="menu-item" onClick={this.allCoursesView} href="/allCourses">All Courses</a>
                        <a className="menu-item" onClick={this.allSharedContent} href="/allCourses">All Shared Content</a>
                        <a className="menu-item" onClick={this.messagesView} href="/messages">Messages</a>
                        {isTeacher && <a id="assignedStudents" className="menu-item" onClick={this.assignedStudentsView} href="/assignedStudents">Assigned Students</a>}
                        <a className="menu-item" onClick={this.logout} href="/">Logout</a>
                    </Menu>
                    <WrappedComponent {...this.props}/>
                </div>
            );
        }

        toggleMenu = () => {
            const burgerButtonElement =  document.getElementsByClassName('bm-burger-button')[0];
            const currentVisibility = burgerButtonElement.style.visibility;
            if(currentVisibility === "hidden") {
                burgerButtonElement.style.visibility = "visible"
            } else {
                burgerButtonElement.style.visibility = "hidden"
            }
        }
        
        allCoursesView = (event) => {
            event.preventDefault();
            this.props.history.push({
                pathname: '/allCourses',
                state: { email: this.props.user.email }
            });
        }

        allSharedContent = (event) => {
            event.preventDefault();
            this.props.history.push('/allSharedContent')
        }
        
        messagesView = (event) => {
            event.preventDefault();
            this.props.history.push('/messages')
        }
        
        assignedStudentsView = (event) => {
            event.preventDefault();
            this.props.history.push('/assignedStudents');
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
