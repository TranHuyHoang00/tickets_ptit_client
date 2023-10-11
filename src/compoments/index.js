import React, { Component } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import User from './users/index';
import DashBoard from './dashboards/index';
import Page_err_not_found from './pages_Err/page_err_not_found';
import LoginPage from './dashboards/pages/loginPage';
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
    }
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/home"><User /></Route>
                    <Redirect from="/" exact to="/home" />
                    <Route path="/dashboard"><DashBoard /></Route>
                    <Route path="/login"><LoginPage /></Route>
                    <Route ><Page_err_not_found /></Route>
                </Switch>
            </div>
        );
    }

}
export default withRouter(index);
