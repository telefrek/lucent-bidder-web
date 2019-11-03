import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'

class CampaignBudget extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        console.log(JSON.stringify(this.props.budget))

        this.state = {
            budget: { ...this.props.budget },
            updated: false
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.updated && this.props.onUpdate != null) {
            this.props.onUpdate(this.state.budget)
            this.setState({ updated: false })
        }
        else
            this.setState({ updated: false })
    }

    handleChange(e) {
        let budget = this.state.budget
        try {
            let old = budget[e.target.name]
            budget[e.target.name] = parseFloat(e.target.value)
            if (!isNaN(budget[e.target.name]))
                this.setState({ budget: budget, updated: true })
            else
                budget[e.target.name] = old
        } catch (error) {
            console.log.error(error);
        }
    }

    onCancel(e) {
        let budget = { ...this.props.budget }
        this.setState({ budget: budget, updated: false })
    }

    componentWillReceiveProps(newProps) {
        this.setState({ updated: JSON.stringify(newProps.budget) !== JSON.stringify(this.state.budget) })
    }

    render() {
        var submit = null;
        var cancel = null;
        if (this.state.updated) {
            submit = (<Button variant='success' type='submit'>Save</Button>)
            cancel = (<Button variant='warning' onClick={this.onCancel.bind(this)}>Cancel</Button>)
        }

        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="budget">Budget</Accordion.Toggle>
                <Accordion.Collapse eventKey="budget">
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
                                    <Form.Label>Max CPM</Form.Label>
                                    <Form.Control name='maxCPM' as='input'
                                        type='number'
                                        onChange={this.handleChange.bind(this)}
                                        defaultValue={this.state.budget.maxCPM} />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Target CPM</Form.Label>
                                    <Form.Control name='targetCPM' as='input'
                                        type='number'
                                        onChange={this.handleChange.bind(this)}
                                        defaultValue={this.state.budget.targetCPM} />
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>

        )
    }
}

export default CampaignBudget;