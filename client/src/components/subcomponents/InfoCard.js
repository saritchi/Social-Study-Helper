import React from 'react'
import './InfoCard.css';
import { Card, CardBody, CardHeader } from 'shards-react'
import OptionsDropdown from './OptionsDropdown'

const InfoCard = (props) => {
    return (
        //Render the card and if needed render the header with a vertical dropdown icon
        <Card>
            { props.options && 
                <CardHeader>
                    <OptionsDropdown name={props.info} id={props.id} 
                                     sharedWithUsers={props.sharedWithUsers}
                                     shareContentCallback={props.shareContentCallback}
                                     removeSharedContentCallback={props.removeSharedContentCallback}
                    />
                </CardHeader> }
            <CardBody onClick={() => props.changePage(props.id, props.info)}>
                <p>{props.info}</p>
            </CardBody>
        </Card>
    ); 
}

export default InfoCard;