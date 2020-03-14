import React from 'react'
import { Card, CardBody } from 'shards-react'

const InfoCard = (props) => {
    return (
        <Card onClick={() => props.changePage(props.id)}>
            <CardBody>
                <p>{props.info}</p>
            </CardBody>
        </Card>
    );
}

export default InfoCard;