import React from 'react'
import './InfoCard.css';
import { Card, CardBody, CardHeader } from 'shards-react'
import OptionsDropdown from './OptionsDropdown'

const InfoCard = (props) => {
    return (
        <Card>
            <CardHeader><OptionsDropdown name={props.info} /></CardHeader>
            <CardBody onClick={() => props.changePage(props.id, props.info)}>
                <p>{props.info}</p>
            </CardBody>
        </Card>
    ); 
}

export default InfoCard;