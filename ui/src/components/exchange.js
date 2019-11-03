import React from 'react';
import Campaigns from './campaign'


class ExchangeSummary extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        let currentJson = {}
        if (this.props.exchange != null) {
            currentJson['name'] = this.props.exchange.name;
        }

        this.state = {
            summary: this.props.summary,
            edit: false,
            exchange: this.props.exchange,
            current: currentJson,
            updated: false,
            campaigns: this.props.campaigns,
            creatives: this.props.creatives
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.updated && this.props.onUpdate != null) {
            let exchange = this.state.exchange;
            if (exchange == null) exchange = {}
            exchange['name'] = this.state.current['name'];

            this.props.onUpdate(exchange)
            this.setState({ edit: false, exchange: exchange })
        }
        else
            this.setState({ edit: false })
    }

    handleChange(e) {
        this.setState({ current: { [e.target.name]: e.target.value }, updated: true })
    }

    handleEdit() {
        this.setState({ edit: true })
    }

    render() {
        if (this.state.edit) {
            return (
                <div className="card">
                    <div className="card-header">Summary - Edit</div>
                    <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                            <label htmlFor="name">Name</label>
                            <input id="name" name="name" type="text" defaultValue={this.state.current.hasOwnProperty('name') ? this.state.current.name : ''} onChange={this.handleChange} />
                            <input type="submit" />
                        </form>
                    </div>
                </div>
            )
        }

        return (
            <div className="card">
                <div className="card-header">Summary</div>
                <div className="card-body">
                    <div className="row">
                        <label>Name: <label>{this.state.current.hasOwnProperty('name') ? this.state.current.name : ''}</label></label>
                    </div>
                    <div className="row">
                        <div className="container-fluid">
                            <Campaigns campaigns={this.state.campaigns} creatives={this.state.creatives} />
                        </div>
                    </div>
                    <button onClick={this.handleEdit} className="btn btn-primary">Edit</button>
                </div>
            </div>
        );
    }
}

class ExchangeBudget extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        let currentJson = {}
        if (this.props.exchange != null) {
            currentJson['budgetSchedule'] = this.props.exchange.budgetSchedule;
        }

        this.state = {
            summary: this.props.summary,
            edit: false,
            exchange: this.props.exchange,
            current: currentJson,
            updated: false
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.updated && this.props.onUpdate != null) {
            let exchange = this.state.exchange;
            if (exchange == null) exchange = {}
            exchange['budgetSchedule'] = this.state.current['budgetSchedule'];

            this.props.onUpdate(exchange)
            this.setState({ edit: false, exchange: exchange })
        }
        else
            this.setState({ edit: false })
    }

    handleChange(e) {
        let v = parseInt(e.target.value)
        if (!isNaN(v)) {
            let currentJson = this.state.current.budgetSchedule;
            if (currentJson == null) currentJson = {}
            currentJson[e.target.name] = v
            this.setState({ current: { budgetSchedule: currentJson }, updated: true })
        }
    }

    handleEdit() {
        this.setState({ edit: true })
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">Budget - Edit</div>
                <div className="card-body">
                    <form {...this.state.edit ? {} : { readOnly: true }} onSubmit={this.handleSubmit}>
                        <div className="row">
                            <label htmlFor="hourly">Hourly</label>
                            <input id="hourly" name="hourly" type="number" defaultValue={this.state.current.hasOwnProperty('budgetSchedule') ? this.state.current.budgetSchedule.hourly : 0} onChange={this.handleChange} />
                        </div>
                        <div className="row">
                            <input type="submit" />
                        </div>
                    </form>
                    {this.state.edit ? null : <button onClick={this.handleEdit} className="btn btn-primary">Edit</button>}
                </div>
            </div>
        )
    }
}

class Exchange extends React.Component {

    constructor(props, context) {
        super(props, context);

        let campaigns = []
        this.props.exchange.campaigns.forEach(element => {
            let c = this.props.campaigns.find((c) => { return c.id === element; })
            if (c != null) {
                campaigns.push(c)
            }
        });

        this.onUpdate = this.onUpdate.bind(this);

        this.state = {
            exchange: this.props.exchange,
            campaigns: campaigns,
            creatives: this.props.creatives,
            updated: false
        }
    }

    onUpdate(exchange) {
        this.setState({ exchange: exchange, updated: true })
    }

    render() {
        let updatePanel = this.state.updated ? <div className="row d-flex justify-content-center"><button className="btn btn-primary">Update</button><button className="btn btn-secondary">Cancel</button></div> : <div className="row"></div>;
        let currentView =
            <div className="panel-group">
                {updatePanel}
                <div className="panel panel-default">
                    <div className="panel-body">
                        <ExchangeSummary exchange={this.state.exchange} campaigns={this.state.campaigns} creatives={this.state.creatives} onUpdate={this.onUpdate} />
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <ExchangeBudget exchange={this.state.exchange} onUpdate={this.onUpdate} />
                    </div>
                </div>
            </div>;

        return currentView;
    }
}

export default Exchange;