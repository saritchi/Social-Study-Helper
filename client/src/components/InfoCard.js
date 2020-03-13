import React from 'react'
import { Card, CardBody } from 'shards-react'

const InfoCard = (props) => {
    return (
        <Card>
            <CardBody>
                <p>{props.info}</p>
            </CardBody>
        </Card>
    );
}

export default InfoCard;