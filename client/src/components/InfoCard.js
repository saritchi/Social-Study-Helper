import React from 'react'
import { Button, Card, CardBody, CardFooter, CardTitle, Collapse } from 'shards-react'

const InfoCard = (props) => {

    return (
        <Card style={{ maxWidth: "500px" }} onClick={() => props.changePage(props.id, props.info)}>
            <CardBody>
                <CardTitle>{props.info}</CardTitle>
                <p>Description Here?</p>
                <Button outline squared>Options</Button>
                {/* <Collapse open={this.state.collapse}>
                    <Button>Edit Deck</Button>
                    <Button>Delete Deck</Button>
                </Collapse> */}
            </CardBody>
            <CardFooter>Say here if in midterm/final set</CardFooter>
        </Card>
    );
}

export default InfoCard;