import React from 'react';
import ReactDOM from 'react-dom';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Campaigns from './campaign'
import Exchange from './exchange'
import { getExchange, getAllCampaigns, getAllCreatives } from '../util'
import { exchangeId } from '../token.json';
import Creatives from './creative';

class LucentMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            campaigns: null,
            exchange: null
        }
    }

    componentDidMount() {
        getAllCampaigns().then(data => {
            this.setState({ campaigns: data });
        })

        getExchange(exchangeId).then(data => {
            this.setState({ exchange: data });
        })

        getAllCreatives().then(data => {
            this.setState({ creatives: data });
        })
    }

    render() {
        const handleSelect = eventKey => {

            let element = document.getElementById("contents");
            if (element.firstChild) {
                ReactDOM.unmountComponentAtNode(element)
            }

            switch (eventKey) {
                case "Campaigns":
                    ReactDOM.render(<Campaigns creatives={this.state.creatives} campaigns={this.state.campaigns} creatives={this.state.creatives} />, document.getElementById('contents'));
                    break;
                case "Exchanges":
                    ReactDOM.render(<Exchange exchange={this.state.exchange} campaigns={this.state.campaigns} creatives={this.state.creatives} />, document.getElementById('contents'));
                    break;
                case "Creatives":
                    ReactDOM.render(<Creatives creatives={this.state.creatives} />, document.getElementById('contents'));
                    break;
                default:
                    break;
            }
        }

        return (
            <Navbar bg="light" variant="light" expand="lg" >
                <Navbar.Brand><img src="/images/lucent-logo.svg" alt="LucentBid" style={{ height: '75px' }} /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav fill variant="tabs" defaultActiveKey="/home" onSelect={handleSelect}>
                        <Nav.Item>
                            <Nav.Link eventKey="Dashboard">Dashboard</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="Exchanges">Exchanges</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="Campaigns">Campaigns</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="Creatives">Creatives</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="disabled" disabled>Disabled</Nav.Link>
                        </Nav.Item>
                        <NavDropdown title="Dropdown" id="nav-dropdown">
                            <NavDropdown.Item eventKey="4.1">Action</NavDropdown.Item>
                            <NavDropdown.Item eventKey="4.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item eventKey="4.3">Something else here</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item eventKey="4.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar >
        );
    }
}

export default LucentMenu;