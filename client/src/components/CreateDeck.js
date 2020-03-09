import React from 'react'
import { Form, FormGroup, FormTextarea, FormCheckbox} from "shards-react";
import { Container, Row, Col } from "shards-react";
import {
    Card,
    CardBody,
    Button
  } from "shards-react";


export default class CreateDeck extends React.Component {
    constructor(props) {
        super(props);

    }
    
    handleSubmit(event){
        this.setState(event.target.value)
        event.preventDefault();
    }

    render(){
        return(
            <Container
                style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                <Row>
                    <Col></Col>
                    <Col>
                        <Card>
                            <CardBody>
                                <Form on>
                                <FormGroup>
                                    <label htmlFor="#CardPrompt">Card Prompt:</label>
                                    <FormTextarea id="#CardPrompt" placeholder="Enter a prompt"></FormTextarea>
                                </FormGroup>
                                <FormGroup>
                                    <label htmlFor="#CardAnswer">Answer:</label>
                                    <FormTextarea id="#CardAnswer" placeholder="Enter the answer for the prompt"></FormTextarea>
                                </FormGroup>
                                <FormGroup>
                                    <Container>
                                        <Row>
                                            <Col></Col>
                                            <Col></Col>
                                            <Col></Col>
                                        </Row>
                                        <Row>
                                            <Col><Button theme="danger">Cancel</Button></Col>
                                            <Col></Col>
                                            <Col><Button type="submit">Add</Button></Col>
                                        </Row>
                                    </Container>
                                </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        );
    }
}

// export default function CreateDeck(){
//     return(
//         <Container
//             style={{
//                 position: 'absolute', left: '50%', top: '50%',
//                 transform: 'translate(-50%, -50%)'
//             }}>
//             <Row>
//                 <Col></Col>
//                 <Col>
//                     <Card>
//                         <CardBody>
//                             <Form>
//                             <FormGroup>
//                                 <label htmlFor="#CardPrompt">Card Prompt:</label>
//                                 <FormTextarea id="#CardPrompt" placeholder="Enter a prompt"></FormTextarea>
//                             </FormGroup>
//                             <FormGroup>
//                                 <label htmlFor="#CardAnswer">Answer:</label>
//                                 <FormTextarea id="#CardAnswer" placeholder="Enter the answer for the prompt"></FormTextarea>
//                             </FormGroup>
//                             <FormGroup>
//                                 <Container>
//                                     <Row>
//                                         <Col></Col>
//                                         <Col></Col>
//                                         <Col></Col>
//                                     </Row>
//                                     <Row>
//                                         <Col><Button theme="danger">Cancel</Button></Col>
//                                         <Col></Col>
//                                         <Col><Button type="submit">Add</Button></Col>
//                                     </Row>
//                                 </Container>
//                             </FormGroup>
//                             </Form>
//                         </CardBody>
//                     </Card>
                
//                 </Col>
//                 <Col></Col>
//             </Row>
//         </Container>

//     );
// }