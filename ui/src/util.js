
import Axios from 'axios';

import { token } from './token.json';


Axios.interceptors.request.use((config) => {
    config.headers.Authorization = 'Bearer ' + token

    return config;
})

const toDateTime = (i) => {
    if (i === 0) return null;
    try {
        return new Date((i - 116444736000000000) / 1e4).toISOString()
    } catch (error) {
        console.log(i + ' : ' + error)
        return null;
    }
}

const fromCampaignStatus = (status) => {
    switch (status) {
        case 1: return 'Active';
        case 2: return 'Paused';
        case 3: return 'BudgetExhausted';
        default: return 'Unknown';
    }
}


const toFiletime = (str) => {
    if (str == null) return null;

    try {
        return new Date(str).getTime() * 1e4 + 116444736000000000;
    } catch (error) {
        return null;
    }
}

const toScheduleType = (str) => {
    switch (str) {
        case 'Metered': return 1;
        case 'Agressive': return 2;
        default: return 0;
    }
}

const toCampaignStatus = (str) => {
    switch (str) {
        case 'Active': return 1;
        case 'Paused': return 2;
        case 'BudgetExhausted': return 3;
        default: return 0;
    }
}

const fromScheduleType = (i) => {
    switch (i) {
        case 1: return 'Metered';
        case 2: return 'Agressive';
        default: return 'Unknown';
    }
}

export const fromUICampaign = (uiCampaign) => {
    if (uiCampaign == null) return null;

    let campaign = { ...uiCampaign }

    if (campaign.etag)
        delete campaign.etag;

    if (campaign.status != null)
        campaign.status = toCampaignStatus(uiCampaign.status);

    if (campaign.schedule != null) {
        campaign.schedule.start = toFiletime(uiCampaign.schedule.start);
        campaign.schedule.end = toFiletime(uiCampaign.schedule.end);
        if (campaign.schedule.end == null)
            delete campaign.schedule.end;
    }

    if (campaign.filters != null) {
        campaign['jsonFilters'] = uiCampaign.filters;
        delete campaign.filters;
    }

    if (campaign.targets != null) {
        campaign['jsonTargets'] = uiCampaign.targets;
        delete campaign.targets;
    }

    if (campaign.budgetSchedule != null)
        campaign.budgetSchedule.type = toScheduleType(uiCampaign.budgetSchedule.type);

    return campaign;
}

export const toUICampaign = (campaign) => {
    if (campaign == null) return null;

    let uiCampaign = { ...campaign }

    if (uiCampaign.status != null)
        uiCampaign.status = fromCampaignStatus(campaign.status);

    if (uiCampaign.schedule != null) {
        uiCampaign.schedule.start = toDateTime(campaign.schedule.start);
        uiCampaign.schedule.end = toDateTime(campaign.schedule.end);
        if (uiCampaign.schedule.end == null)
            delete uiCampaign.schedule.end;
    }

    if (uiCampaign.budgetSchedule != null)
        uiCampaign.budgetSchedule.type = fromScheduleType(campaign.budgetSchedule.type);

    return uiCampaign;
}

export const getAllCreatives = () => {
    return Axios.get('https://orchestration.lucentbid.com/api/creatives').then((resp) => {
        let creatives = [];
        if (resp.status === 200) {
            resp.data.forEach(element => {
                creatives.push(element);
            });
        }

        return creatives;
    });
}

export const getAllCampaigns = () => {
    return Axios.get('https://orchestration.lucentbid.com/api/campaigns').then((resp) => {
        let campaigns = [];
        if (resp.status === 200) {
            resp.data.forEach(element => {
                campaigns.push(toUICampaign(element));
            });
        }

        return campaigns;
    });
}

export const createCampaign = (campaign) => {
    return Axios.post('https://orchestration.lucentbid.com/api/campaigns', fromUICampaign(campaign)).then((resp) => {
        if (resp.status === 201) {
            let campaign = resp.data

            campaign['etag'] = resp.headers['x-lucent-etag']
            return campaign;
        }

        return null
    });
}

export const updateCampaign = (campaign) => {
    let etag = campaign.etag;
    return Axios.put('https://orchestration.lucentbid.com/api/campaigns/' + campaign.id, fromUICampaign(campaign), { headers: { 'x-lucent-etag': etag } }).then((resp) => {
        if (resp.status === 202) {
            let campaign = resp.data

            campaign['etag'] = resp.headers['x-lucent-etag']
            return toUICampaign(campaign);
        }

        return null
    });
}

export const getCampaign = (id) => {
    return Axios.get('https://orchestration.lucentbid.com/api/campaigns/' + id).then((resp) => {
        if (resp.status === 200) {
            let campaign = resp.data

            campaign.etag = resp.headers['x-lucent-etag']
            return toUICampaign(campaign);
        }

        return null
    });
}

export const getExchange = (id) => {
    return Axios.get('https://orchestration.lucentbid.com/api/exchanges/' + id).then((resp) => {
        if (resp.status === 200) {
            let exchange = resp.data

            exchange['etag'] = resp.headers['x-lucent-etag']
            return exchange;
        }

        return null
    });
}

export default getAllCampaigns;