import React from 'react'
import './InfoCard.css';
import { Card, CardBody, CardHeader, CardTitle } from 'shards-react'
import OptionsDropdown from './OptionsDropdown'

const InfoCard = (props) => {
    return (
        <Card>
            {props.options && 
                <CardHeader>
                    <OptionsDropdown name={props.info}
                                     {...props}
                    />
                </CardHeader>
            }
            <CardBody onClick={() => props.changePage(props.id, props.info)}>
                <CardTitle>{props.info}</CardTitle>
            </CardBody>
        </Card>
    ); 
}
export default InfoCard;