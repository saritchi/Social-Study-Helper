import React, { Component } from "react";
import { Dropdown,DropdownMenu,DropdownItem } from "shards-react";
import { FiMoreVertical } from 'react-icons/fi'
import ShareModal from './ShareModal'


export default class OptionsDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = { openMenu: false, openShareMenu: false};
  }

  toggle = () => this.setState({openMenu: !this.state.openMenu});

  toggleShareMenu = () => this.setState({openShareMenu: !this.state.openShareMenu})

  render() {
    console.log(this.props.id);
    return (
      <div>
        <ShareModal key={this.props.sharedWithUsers}
                    open={this.state.openShareMenu}
                    toggle={this.toggleShareMenu}
                    {...this.props}
          />
        <Dropdown open={this.state.openMenu} toggle={this.toggle}>
          <FiMoreVertical onClick={this.toggle}/>
          <DropdownMenu>
            <DropdownItem onClick={() => this.props.editCallback(this.props.id)}>Edit</DropdownItem>
            <DropdownItem onClick={() => this.props.deleteCallback(this.props.id)}>Delete</DropdownItem>
            <DropdownItem onClick={this.toggleShareMenu}>Share</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}
