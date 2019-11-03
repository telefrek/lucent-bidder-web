import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'

class CampaignSummary extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            summary: { ...this.props.summary },
            updated: false
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.updated && this.props.onUpdate != null) {
            this.props.onUpdate(this.state.summary)
            this.setState({ updated: false })
        }
        else
            this.setState({ updated: false })
    }

    handleChange(e) {
        let summary = this.state.summary
        summary[e.target.name] = e.target.value
        this.setState({ summary: summary, updated: true })
    }

    onCancel(e) {
        let summary = { ...this.props.summary }
        console.log(JSON.stringify(summary))
        this.setState({ summary: summary, updated: false })
    }

    componentWillReceiveProps(newProps) {
        this.setState({ updated: JSON.stringify(newProps.summary) !== JSON.stringify(this.state.summary) })
    }

    render() {
        var submit = null;
        var cancel = null;
        if (this.state.updated) {
            submit = (<Button variant='success' type='submit'>Save</Button>)
            cancel = (<Button variant='warning' onClick={this.onCancel.bind(this)}>Cancel</Button>)
        }

        return (
            <Card key='summary'>
                <Accordion.Toggle as={Card.Header} eventKey="summary">Summary</Accordion.Toggle>
                <Accordion.Collapse eventKey="summary">
                    <Card.Body>
                        <Form noValidate onSubmit={this.handleSubmit}>
                            <Form.Row>
                                <Form.Group>
                                    <ButtonToolbar>
                                        {submit}
                                        {cancel}
                                    </ButtonToolbar>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control name='name' as='input'
                                        type='text'
                                        onChange={this.handleChange.bind(this)}
                                        defaultValue={this.state.summary.name} />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control name='status' as='select'
                                        onChange={this.handleChange.bind(this)}
                                        defaultValue={this.state.summary.status}>
                                        {[['Active', 'Paused', 'BudgetExhausted', 'Unknown'].map((opt) => {
                                            return opt == this.state.summary.status ? <option key={opt} value={opt} selected>{opt}</option>
                                                : <option key={opt} value={opt}>{opt}</option>
                                        })]}
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>

        )
    }
}

export default CampaignSummary;