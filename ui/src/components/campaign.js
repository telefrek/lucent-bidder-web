import React from 'react';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import CampaignTargets from './campaign/CampaignTargets'
import CampaignFilters from './campaign/CampaignFilters'
import CampaignCreative from './campaign/CampaignCreative';
import CampaignBudget from './campaign/CampaignBudget'
import CampaignSummary from './campaign/CampaignSummary'
import { updateCampaign, getCampaign } from '../util'

class CampaignMetadata extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            campaign: this.props.campaign
        };
    }

    render() {

        return (<tr className='m-1' id={this.state.campaign.id} onClick={() => this.props.showCampaign(this.state.campaign)}>
            <td>{this.state.campaign.id}</td>
            <td>{this.state.campaign.name}</td>
            <td>{this.state.campaign.status}</td>
            <td>{this.state.campaign.schedule.start}</td>
            <td>{this.state.campaign.schedule.end}</td>
        </tr>)
    }
}

class Campaigns extends React.Component {
    constructor(props) {
        super(props);
        this.showCampaign = this.showCampaign.bind(this);
        this.hideCampaign = this.hideCampaign.bind(this);
        this.state = {
            show: false,
            campaign: null,
            campaigns: this.props.campaigns,
            creatives: this.props.creatives
        }
    }

    showCampaign(e) {
        if (e == null) return
        if (this.state.campaigns != null) {
            let c = this.state.campaigns.find((c) => { return c.id === e.id; })
            getCampaign(c.id).then(data => this.setState({ campaign: data }))
        } else {
            console.log('ERROR: This shouldn\'t be possible')
        }
    }

    hideCampaign() {
        this.setState({ campaign: null });
    }

    render() {
        if (this.state.campaigns == null)
            return (<div className='container'>Loading...</div>)

        if (this.state.campaign != null) {
            return (
                <div className='container'>
                    <LucentCampaign campaign={this.state.campaign} creatives={this.state.creatives} />
                    <button className="btn-secondary" onClick={this.hideCampaign}>Back</button>
                </div>)
        }

        return (<div className='container'>
            <table className="table table-hover">
                <caption>All campaigns</caption>
                <thead className='thead-light'>
                    <tr>
                        <th scope='col'>Id</th>
                        <th scope='col'>Name</th>
                        <th scope='col'>Status</th>
                        <th scope='col'>Start</th>
                        <th scope='col'>End</th>
                        <th scope='col'>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.campaigns.map(item => {
                            return <CampaignMetadata campaign={item} key={item.id} showCampaign={this.showCampaign} />
                        })
                    }
                </tbody>
            </table>
        </div>
        )
    }
}

class LucentCampaign extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.onUpdate = this.onUpdate.bind(this);

        this.state = {
            campaign: { ...this.props.campaign },
            creatives: this.props.creatives,
            updated: false
        }
    }

    onUpdate(campaign) {
        this.setState({ campaign: campaign, updated: true })
    }

    onFilterUpdate(filters) {
        let campaign = this.state.campaign;
        campaign.filters = filters;

        updateCampaign(campaign).then(data => {
            this.setState({ campaign: data });
        })
    }

    onTargetUpdate(targets) {
        let campaign = this.state.campaign;
        campaign.targets = targets;

        updateCampaign(campaign).then(data => {
            this.setState({ campaign: data });
        })
    }

    onBudgetUpdate(budget) {
        let campaign = this.state.campaign;
        campaign['targetCPM'] = budget.targetCPM
        campaign['maxcpm'] = budget.maxCPM

        updateCampaign(campaign).then(data => {
            this.setState({ campaign: data });
        })
    }

    onSummaryUpdate(summary) {
        let campaign = this.state.campaign;
        campaign['name'] = summary.name
        campaign['status'] = summary.status

        updateCampaign(campaign).then(data => {
            this.setState({ campaign: data });
        })
    }

    render() {
        let budget = {}
        budget['targetCPM'] = this.state.campaign.targetCPM
        budget['maxCPM'] = this.state.campaign.maxcpm

        let summary = {}
        summary['name'] = this.state.campaign.name
        summary['status'] = this.state.campaign.status

        let currentView =
            <Accordion defaultActiveKey="campaign-summary">
                <CampaignSummary summary={summary} onUpdate={this.onSummaryUpdate.bind(this)} />
                <CampaignFilters filters={this.state.campaign.jsonFilters || []} onUpdate={this.onFilterUpdate.bind(this)} />
                <CampaignTargets targets={this.state.campaign.jsonTargets || []} onUpdate={this.onTargetUpdate.bind(this)} />
                <CampaignBudget budget={budget} onUpdate={this.onBudgetUpdate.bind(this)} />
                <CampaignCreative campaign={this.state.campaign} creatives={this.state.creatives} onUpdate={this.onUpdate} />
            </Accordion>;

        return currentView;
    }
}

export default Campaigns;