import React from "react";
import { Button, Nav, NavItem, NavLink, Modal, ModalBody, ModalHeader  } from "shards-react";
import { TiMediaPlayReverse } from 'react-icons/ti';
import './BackButton.css';


const BackButton = (props) => {
    console.log(props.warning)
    if(props.warning){
        return (
            <Nav>
                <NavItem id="back-button">
                    <NavLink href="#" onClick={props.toggle}><TiMediaPlayReverse size={20} />Back to {props.page}</NavLink>
                    <Modal size="sm" open={props.open} toggle={props.toggle}>
                        <ModalHeader>Warning!</ModalHeader>
                        <ModalBody>You will lose all your progess if you choose to go back to the {props.page} screen.
                            Are you sure you would like to go back?
                            <Button id="modal-button" theme="danger" onClick={props.goback}>Go Back</Button>
                            <Button id="modal-button" onClick={props.toggle}>Cancel</Button>
                        </ModalBody>
                    </Modal>
                </NavItem>
            </Nav>
        );
    }
    else{
        return (
            <Nav>
                <NavItem id="back-button">
                    <NavLink href="#" onClick={props.goback}><TiMediaPlayReverse size={20} />Back to {props.page}</NavLink>
                </NavItem>
            </Nav>
        );
    }

}

export default BackButton;