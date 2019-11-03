import React from 'react';
import JsonTarget from './JsonTarget'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import CardColumn from 'react-bootstrap/CardColumns'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'

class CampaignFilters extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);

        let filters = []
        let id = 0;
        this.props.filters.forEach((t) => {
            t['id'] = id++;
            filters.push(t)
        });

        this.state = {
            filters: filters,
            updated: false,
            id: id
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({ updated: JSON.stringify(newProps.filters) !== JSON.stringify(this.state.filters) })
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.updated && this.props.onUpdate != null) {
            this.props.onUpdate(this.state.filters)
            this.setState({ updated: false })
        }
        else
            this.setState({ updated: false })
    }

    filterChanged(e) {
        let filters = this.state.filters;
        filters[e.index] = e.target;
        this.setState({ filters: filters, updated: true })
    }

    filterRemoved(e) {
        let filters = this.state.filters
        filters.splice(e.index, 1);
        this.setState({ filters: filters, updated: true })
    }

    onAdd(e) {
        let filters = this.state.filters
        let id = this.state.id
        filters.push({ id: id++ })
        this.setState({ filters: filters, id: id, updated: true })
    }

    onCancel(e) {
        let filters = []
        this.props.filters.forEach((t) => {
            filters.push(t)
        });
        this.setState({ filters: filters, updated: false })
    }

    render() {

        var filters = [];
        this.state.filters.forEach((filter, i) => {
            filters.push(<JsonTarget key={filter.id} target={filter} index={i} onChanged={this.filterChanged.bind(this)} onDelete={this.filterRemoved.bind(this)} />)
        });

        var submit = null;
        var cancel = null;
        if (this.state.updated) {
            submit = (<Button variant='success' type='submit'>Save</Button>)
            cancel = (<Button variant='warning' onClick={this.onCancel.bind(this)}>Cancel</Button>)
        }

        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="filters">Filters</Accordion.Toggle>
                <Accordion.Collapse eventKey="filters">
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
                                        {filters}
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

export default CampaignFilters;