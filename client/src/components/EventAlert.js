import React, {Component} from "react";
import { Alert } from "shards-react";

export default class EventAlert extends Component {
  render() {
    return (
      <Alert theme={this.props.theme} dismissible={this.dismiss} open={this.props.visible}>
          {this.props.message}
      </Alert>
    );
  }

  dismiss = () => {
    this.props.dismissAlert();
  }
}
