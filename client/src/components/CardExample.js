import React from 'react'
import { Card, CardBody } from 'shards-react'

export default function CardExample(props) {
    return(
        <Card>
            <CardBody>
                {props.value}
            </CardBody>
        </Card>
    );
}