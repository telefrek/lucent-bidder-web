import React from 'react';
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'

class ImageContentCard extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            creative: this.props.creative,
            content: this.props.content != null ? this.props.content : {}
        }
    }

    render() {
        return (<Card>
            <Card.Header>
                <Form.Label>{this.state.content.h}x{this.state.content.w}</Form.Label>
            </Card.Header>
            <Card.Img variant="top" src={this.state.content.creative_uri} />
            <Card.Body>
                <Form.Row>
                    <Form.Label>Name</Form.Label>
                    <Form.Control as='input' type='text' readOnly defaultValue={this.state.content.content_location.split('/').pop()} />
                </Form.Row>
                <Form.Row>
                    <Form.Label>Mime Type</Form.Label>
                    <Form.Control as='input' type='text' readOnly defaultValue={this.state.content.mime_type} />
                </Form.Row>
            </Card.Body>
        </Card>)
    }
}

export default ImageContentCard;