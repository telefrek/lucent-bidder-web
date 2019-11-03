import React from 'react';
import JsonTarget from './JsonTarget'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import CardColumn from 'react-bootstrap/CardColumns'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'

class CampaignTargets extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);

        let targets = []
        let id = 0;
        this.props.targets.forEach((t) => {
            t['id'] = id++;
            targets.push(t)
        });

        this.state = {
            targets: targets,
            updated: false,
            id: id
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({ updated: JSON.stringify(newProps.targets) !== JSON.stringify(this.state.targets) })
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.updated && this.props.onUpdate != null) {
            this.props.onUpdate(this.state.targets)
            this.setState({ updated: false })
        }
        else
            this.setState({ updated: false })
    }

    targetChanged(e) {
        let targets = this.state.targets;
        targets[e.index] = e.target;
        this.setState({ targets: targets, updated: true })
    }

    targetRemoved(e) {
        let targets = this.state.targets
        targets.splice(e.index, 1);
        this.setState({ targets: targets, updated: true })
    }

    onAdd(e) {
        let targets = this.state.targets
        let id = this.state.id
        targets.push({ id: id++ })
        this.setState({ targets: targets, id: id, updated: true })
    }

    onCancel(e) {
        let targets = []
        this.props.targets.forEach((t) => {
            targets.push(t)
        });
        this.setState({ targets: targets, updated: false })
    }

    render() {

        var targets = [];
        this.state.targets.forEach((target, i) => {
            targets.push(<JsonTarget key={target.id} target={target} index={i} onChanged={this.targetChanged.bind(this)} onDelete={this.targetRemoved.bind(this)} />)
        });

        var submit = null;
        var cancel = null;
        if (this.state.updated) {
            submit = (<Button variant='success' type='submit'>Save</Button>)
            cancel = (<Button variant='warning' onClick={this.onCancel.bind(this)}>Cancel</Button>)
        }

        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="targets">Targets</Accordion.Toggle>
                <Accordion.Collapse eventKey="targets">
                    <Card.Body>
                        <Form noValidate onSubmit={this.handleSubmit}>
                            <Form.Row>
                                <Form.Group>
                                    <ButtonToolbar>
                                        <Button variant='primary' onClick={this.onAdd.bind(this)}>Add</Button>
                                        {submit}
                                        {cancel}
                                    </ButtonToolbar>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <CardColumn>
                                        {targets}
                                    </CardColumn>
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        )
    }
}

export default CampaignTargets;