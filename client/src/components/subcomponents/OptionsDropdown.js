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
    return (
      <div>
        <ShareModal open={this.state.openShareMenu} 
                    name={this.props.name} 
                    id={this.props.id} 
                    sharedContentCallback={this.props.shareContentCallback}
                    removeSharedCourseCallback={this.props.removeSharedCourseCallback}
                    sharedWithUsers={this.props.sharedWithUsers}
                    toggle={this.toggleShareMenu}
          />
        <Dropdown open={this.state.openMenu} toggle={this.toggle}>
          <FiMoreVertical onClick={this.toggle}/>
          <DropdownMenu>
            <DropdownItem>Edit</DropdownItem>
            <DropdownItem>Delete</DropdownItem>
            <DropdownItem onClick={this.toggleShareMenu}>Share</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}
