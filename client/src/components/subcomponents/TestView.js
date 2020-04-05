import React from 'react'
import { ListGroup, ListGroupItem, Container, Row, Col, Button } from 'shards-react'
import './TestView.css'

const TestList = (props) => {
    return (
        <div className="tests">
            <ListGroup>
                {props.testInfo.map(testInfo =>
                    <Container className="testRow" key={testInfo.id}>
                        <Row>
                            <Col className="testCol" >
                                <ListGroupItem key={testInfo.id}>
                                    {props.courses[testInfo.courseId].name}:   {(testInfo.name)} on {props.dateParse(testInfo.testDate)}
                                </ListGroupItem>
                            </Col>
                            <Col xs="auto">
                                <Button className="testDelete" theme="light" squared onClick={() => props.handleDelete(testInfo.id)}>Delete</Button>
                            </Col>
                        </Row>
                    </Container>
                )}
            </ListGroup>
        </div>
    )
};

export default TestList