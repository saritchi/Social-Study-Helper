import React, {Component} from 'react'
import { Alert } from "shards-react";

export const withAlert = (WrappedComponent) => {
    class WithAlert extends Component {
        state = { 
            theme: 'danger',
            message: '',
            visible: false 
        }

        render() {
            return (
                <div>
                    <Alert theme={this.state.theme} dismissible={this.dismiss} open={this.state.visible}>
                        {this.state.message}
                    </Alert>
                    <WrappedComponent showAlert={this.showAlert} {...this.props}/>
                </div>
            );
        }

        showAlert = (theme, message) => this.setState({theme: theme, message: message, visible:true})
        
        

        dismiss = () => this.setState({visible: false});
        
    }

    return WithAlert;
};

export const errorTheme = 'danger';
export const successTheme = 'success';
