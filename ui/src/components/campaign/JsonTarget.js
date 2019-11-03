import React from 'react';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

class JsonTarget extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleClose = this.handleClose.bind(this);
        this.onModalValueChange = this.onModalValueChange.bind(this);
        this.removeValue = this.removeValue.bind(this);
        this.translateValue = this.translateValue.bind(this);
        this.filterChanged = this.filterChanged.bind(this);

        this.state = {
            edit: false,
            updated: false,
            target: { ...this.props.target },
            show: false,
            modalValue: '',
            selectedValue: ''
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({ updated: JSON.stringify(newProps.target) !== JSON.stringify(this.state.target), index: newProps.index })
    }

    mapProperties(val) {
        let properties = []
        switch (val) {
            case 'geo':
                properties = ['country', 'region', 'metro', 'city', 'zip', 'isp', 'type']
                break;
            case 'user':
                properties = ['id', 'buyerId', 'yob', 'gender', 'keywords'];
                break;
            case 'app':
                properties = ['id', 'name', 'domain', 'appCategory', 'sectionCategory', 'pageCategory', 'version', 'bundle', 'isPaid', 'keywords', 'storeUrl'];
                break;
            case 'site':
                properties = ['id', 'name', 'domain', 'siteCategory', 'sectionCategory', 'pageCategory', 'page', 'referrerUrl', 'searchUrl', 'isMobileOptimized', 'keywords'];
                break;
            case 'impression':
                properties = ['id', 'displayManager', 'displayManagerVersion', 'isFullscreen', 'tagId', 'bidFloor', 'bidCurrency', 'iframeBusters', 'isSecure', 'isClickNative'];
                break;
            case 'device':
                properties = ['carrier', 'language', 'make', 'model', 'os', 'os_version', 'id', 'h', 'w', 'javascript', 'ppi'];
                break;
            default:
                console.warn('Unknown entity: ' + val);
                break;
        }

        return properties
    }

    filterChanged(e) {

        let target = this.state.target;

        switch (e.target.name) {
            case 'modifier':
                target[e.target.name] = parseFloat(e.target.value);
                break;
            case 'property':
            case 'operation':
            case 'entity':
                target[e.target.name] = e.target.value;
                break;
            case 'value':
                target[e.target.name] = e.target.value;
                break;
            case 'values':
                break;
            default:
                console.warn('Invalid target: ' + e.target.name);
                break;
        }

        this.setState({ target: target, updated: true })

        if (this.props.onChanged != null) {
            this.props.onChanged({ target: target, index: this.props.index })
        }
    }

    onModalValueChange(e) {
        this.setState({ modalValue: e.target.value })
    }

    translateValue(e) {
        try {
            if (e.target.value.includes('.')) {
                let val = parseFloat(e.target.value)
                if (!isNaN(val)) return val;
            }
        } catch (e) {

        }

        try {
            let val = parseInt(e.target.value)
            if (!isNaN(val)) return val;
        } catch (e) {

        }

        let val = e.target.value
        if (val === "true") return true;
        if (val === "false") return false;

        return val;
    }

    handleClose(e) {
        let target = this.state.target;
        let values = this.state.target.hasOwnProperty('values') ? this.state.target.values : []
        let newObj = {}

        try {
            if (this.state.modalValue.includes('.')) {
                newObj['dval'] = parseFloat(this.state.modalValue)
                if (isNaN(newObj.dval)) {
                    delete newObj.dval
                } else {
                    values.push(newObj)
                    target['values'] = values
                    this.setState({ show: false, modalValue: '', target: target, updated: true })
                    return
                }
            }
        } catch (e) {
            console.log('failed to parse as float: ' + this.state.modalValue)
        }

        try {
            newObj['ival'] = parseInt(this.state.modalValue)
            if (isNaN(newObj.ival)) {
                delete newObj.ival
            } else {
                values.push(newObj)
                target['values'] = values
                this.setState({ show: false, modalValue: '', target: target, updated: true })
                return
            }
        } catch (e) {
            console.log('failed to parse as int: ' + this.state.modalValue)
        }

        let val = this.state.modalValue

        if (val === 'true') {
            newObj['bval'] = true
        } else if (val === 'false') {
            newObj['bval'] = false
        } else {
            newObj['sval'] = val
        }
        values.push(newObj)
        target['values'] = values
        this.setState({ show: false, modalValue: '', target: target, updated: true })
    }

    removeValue(e) {
        if (this.state.selectedValue != null && this.state.target.hasOwnProperty('values')) {
            let values = this.state.target.values;

            let newValues = [];
            values.forEach((v) => {
                let val = this.extractValue(v);
                if (val != null && val !== this.state.selectedValue) {
                    newValues.push(v);
                }
            })

            let target = this.state.target;
            target['values'] = newValues;

            this.setState({ target: target, updated: true })
        }
    }

    extractValue(e) {
        if (e.hasOwnProperty('sval')) {
            return e.sval
        }
        if (e.hasOwnProperty('dval')) {
            return e.dval;
        }
        if (e.hasOwnProperty('bval')) {
            return e.bval
        }
        if (e.hasOwnProperty('ival')) {
            return e.ival;
        }
        if (e.hasOwnProperty('lval')) {
            return e.lval;
        }

        return null;
    }

    render() {

        var entity = this.state.target.hasOwnProperty('entity') ? this.state.target.entity : '';
        var property = this.state.target.hasOwnProperty('property') ? this.state.target.property : ''
        var operation = this.state.target.hasOwnProperty('operation') ? this.state.target.operation : 'eq';
        var multiplier = this.state.target.hasOwnProperty('modifier') ? this.state.target.modifier : 0;
        var value = null;
        var values = []

        if (this.state.target.hasOwnProperty('value'))
            values.push(this.extractValue(this.state.target.value))

        if (this.state.target.hasOwnProperty('values'))
            this.state.target.values.forEach(v => values.push(this.extractValue(v)));

        switch (operation) {
            case 'in':
            case 'notin':
                value = (
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Values</Form.Label>
                            <Form.Control as="select"
                                name='values'
                                onClick={(e) => this.setState({ selectedValue: this.translateValue(e) })}>
                                {values.map(opt =>
                                    (<option key={opt} value={opt}>{opt}</option>)
                                )}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Update</Form.Label>
                            <Form.Group>
                                <Button variant="primary" onClick={(e) => this.setState({ show: true })}>+</Button>
                                <Button variant="secondary" onClick={this.removeValue}>-</Button>
                            </Form.Group>
                        </Form.Group>
                        <Modal show={this.state.show} onHide={(e) => this.setState({ show: false })}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add Value</Modal.Title>
                            </Modal.Header>
                            <Modal.Body><Form.Control as="input" type="text" onChange={this.onModalValueChange}></Form.Control></Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={(e) => this.setState({ show: false })}>
                                    Close
                            </Button>
                                <Button variant="primary" onClick={this.handleClose
                                }>
                                    Save Changes
                            </Button>
                            </Modal.Footer>
                        </Modal>
                    </Form.Row>);
                break;
            case 'hasvalue':
                break;
            default:
                value = (
                    <Form.Group as={Col}>
                        <Form.Label>Value</Form.Label>
                        <Form.Control as='input'
                            type='text'
                            name='value'
                            defaultValue={values.length > 0 ? values[0] : ''}
                            onChange={(e) => this.setState({ selectedValue: this.translateValue(e) })} />
                    </Form.Group>);
                break;
        }

        //style={{ width: '18rem' }}

        return (
            <Card border={this.state.updated ? "warning" : "light"} style={{
                'borderWidth': '3px'
            }
            }>
                <Card.Header>
                    <Form.Label>{entity + '.' + property + ' ' + operation}</Form.Label>
                    <Button className="float-right text-white" variant='danger' size='sm' onClick={(e) => {
                        if (this.props.onDelete) {
                            this.props.onDelete({ index: this.props.index })
                        }
                    }}>x</Button>
                </Card.Header>
                <Card.Body>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Entity</Form.Label>
                            <Form.Control as="select"
                                defaultValue={entity}
                                onChange={this.filterChanged}
                                name='entity'>
                                {['geo', 'user', 'impression', 'app', 'site', 'device'].map(opt =>
                                    (<option key={opt} value={opt}>{opt}</option>)
                                )}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Property</Form.Label>
                            <Form.Control as="select"
                                defaultValue={property}
                                onChange={this.filterChanged}
                                name='property'>
                                {this.mapProperties(entity).map(opt =>
                                    (<option key={opt} value={opt}>{opt}</option>)
                                )}
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Operation</Form.Label>
                            <Form.Control as="select"
                                defaultValue={operation}
                                onChange={this.filterChanged}
                                name='operation'>
                                {['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'notin', 'hasvalue'].map(opt =>
                                    (<option key={opt} value={opt}>{opt}</option>)
                                )}
                            </Form.Control>
                        </Form.Group>
                        {value}
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Modifier</Form.Label>
                            <Form.Control as="input" type="text"
                                defaultValue={multiplier}
                                onChange={this.filterChanged}
                                name='modifier'></Form.Control>
                        </Form.Group>
                    </Form.Row>
                </Card.Body>
            </Card >
        );
    }
}

export default JsonTarget;