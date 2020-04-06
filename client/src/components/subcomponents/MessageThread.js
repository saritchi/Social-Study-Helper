import React from 'react'
import { ListGroup, ListGroupItem } from 'shards-react'
import './MessageThread.css'

const MessageThread = (props) => {
    console.log(props.user)
    return (
        <ListGroup small={true} flush={true} id="messages">
            
            {
                props.messages.map((messageObj, index) => {
                    var userMessage = '';
                    var className
                    if(messageObj.fromUser ===  props.user.email) {
                        className = 'even'
                        userMessage = 'You: ' + messageObj.message;
                    } else {
                        className = 'odd'
                        userMessage = messageObj.fromUser + ': ' + messageObj.message;
                    }
                    return <ListGroupItem key={index} className={className}>
                        {userMessage}
                    </ListGroupItem>
                })
            }
        </ListGroup>
    )
};

export default MessageThread;