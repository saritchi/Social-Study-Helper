import React from 'react'
import { ListGroup, ListGroupItem, Container, Row, Col, Button } from 'shards-react'
import { TiDelete } from 'react-icons/ti';
import './TestView.css'

export default class TestList extends React.Component {
    constructor(props) {
        super(props);
        this.getIndex = this.getIndex.bind(this);
    }


    render() {
        return (
            <div className="tests">
                <ListGroup>
                    {this.props.testInfo.map(testInfo =>
                        <Container className="testRow" key={testInfo.id}>
                            <Row>
                                <Col className="testCol" >
                                    <ListGroupItem key={testInfo.id}>
                                        {this.props.courses[this.getIndex(testInfo.courseId)].name}:   {(testInfo.name)} on {this.props.dateParse(testInfo.testDate)}
                                    </ListGroupItem>
                                </Col>
                                <Col xs="auto">
                                    <TiDelete  onClick={() => this.props.handleDelete(testInfo.id)}/>
                                </Col>
                            </Row>
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
