import React from 'react'
import { Card, ListGroup, ListGroupItem, Container, Row, Col, Button } from 'shards-react'
import { TiDelete } from 'react-icons/ti';
import './TestView.css'

export default class TestList extends React.Component {
    constructor(props) {
        super(props);
        this.getIndex = this.getIndex.bind(this);
    }


    render() {
        return (
            <div className="tests-list">
                <ListGroup id="list-container">
                    {this.props.testInfo.map(testInfo =>
                        <Container className="test-list-container" key={testInfo.id}>
                            <Card>
                                <Row className="testRow">
                                    <Col className="testCol" >
                                        {/* <ListGroupItem key={testInfo.id}> */}
                                            <h6 className="test-list-text"><b>{this.props.courses[this.getIndex(testInfo.courseId)].name}</b>:   {(testInfo.name)} on {this.props.dateParse(testInfo.testDate)}</h6>
                                        {/* </ListGroupItem> */}
                                    </Col>
                                    <Col xs="auto">
                                        <TiDelete  size={30} onClick={() => this.props.handleDelete(testInfo.id)}/>
                                    </Col>
                                </Row>
                            </Card>
                        </Container>
                    )}
                </ListGroup>
            </div>
        );
    }
    getIndex (courseId) {
        var index = this.props.courses.findIndex(course => course.id === courseId);
        return index;
    }
}
