import React, { Component } from 'react'
import { Button } from "shards-react";
import { Collapse } from "shards-react";

export default class Toggle extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false, value: null };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    return (
      <div>
        <Button onClick={this.toggle}>Toggle</Button>
        <Collapse open={this.state.collapse}>
          <div className="p-3 mt-3 border rounded">
            <h5>Data from server</h5>
            <span>
                {this.props.value}
            </span>
          </div>
        </Collapse>
      </div>
    );
  }
}