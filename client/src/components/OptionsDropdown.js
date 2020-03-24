import React from "react";
import { Dropdown,DropdownMenu,DropdownItem } from "shards-react";
import { FiMoreVertical } from 'react-icons/fi'


export default class OptionsDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  toggle = () => this.setState({open: !this.state.open});

  render() {
    return (
      <Dropdown open={this.state.open} toggle={this.toggle}>
        <FiMoreVertical onClick={this.toggle}/>
        <DropdownMenu>
          <DropdownItem>Edit</DropdownItem>
          <DropdownItem>Delete</DropdownItem>
          <DropdownItem>Share</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}
