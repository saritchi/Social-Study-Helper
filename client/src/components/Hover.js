import React, { Component } from "react";
import { Tooltip, Button } from "shards-react";

export default class Hover extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { open: false, value: null };
      }
    
      toggle() {
        this.setState({
          open: !this.state.open
        });
      }
    
      render() {
        return (
          <div>
            <Button id="TooltipExample">Hover Me!</Button>
            <Tooltip
              open={this.state.open}
              target="#TooltipExample"
              toggle={this.toggle}
            >
                {this.props.value}
            </Tooltip>
          </div>
        );
      }
}