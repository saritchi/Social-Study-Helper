import React, {Component} from 'react'
import { Alert } from "shards-react";

export const withAlert = (WrappedComponent) => {
    class WithAlert extends Component {
        constructor(props){
            super(props);

            this.interval = null;
            this.state = { 
                theme: 'danger',
                message: '',
                visible: false,
                countdown: 0,
                timeUntilDismissed: 5
            }
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

        showAlert = (theme, message) => {
            this.clearInterval();
            this.setState({theme: theme, message: message, visible:true, countdown: 0, timeUntilDismissed: 5})
            this.interval = setInterval(this.handleTimeChange, 1000);
        }

        handleTimeChange = () => {
            if (this.state.countdown < this.state.timeUntilDismissed - 1) {
                this.setState({
                  ...this.state,
                  ...{ countdown: this.state.countdown + 1 }
                });
                return;
              }
          
              this.setState({ ...this.state, ...{ visible: false } });
              this.clearInterval();           
        }
        
        clearInterval = () => {
            clearInterval(this.interval);
            this.interval = null;
        }

        componentWillUnmount() {
            this.clearInterval();
        }
        
    }

    return WithAlert;
};
//
export const errorTheme = 'danger';
export const successTheme = 'success';
