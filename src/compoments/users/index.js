import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import { getEvent } from '../../services/eventService';

import Header from './layouts/header';
import Footer from './layouts/footer';

import Home from './pages/home';
import Form from './pages/form';
import Checkout from './pages/checkout';

import Page_err_not_found from '../pages_Err/page_err_not_found';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: 'Lỗi Server 3',
            status_Event: 3,
        }
    }
    async componentDidMount() {
        await this.getEvent();
    }
    checkEvent = (dataEvent) => {
        if (dataEvent.is_activate == true) {
            let DateNow = new Date();
            let expiry_date = new Date(dataEvent.expiry_date);
            if (DateNow > expiry_date) {
                this.setState({
                    alert: 'Đã hết hạn đăng ký',
                    status_Event: 4,
                })
            }
            if (DateNow < expiry_date) {
                this.setState({
                    alert: 'Sự kiện đang mở',
                    status_Event: 0,
                })
            }
        } else {
            this.setState({
                alert: 'Sự kiện đang đóng',
                status_Event: 4,
            })
        }
    }
    getEvent = async () => {
        try {
            let data = await getEvent();
            if (data && data.data && data.data.success == 1) {
                this.checkEvent(data.data.data);
            } else {
                this.setState({ status_Event: 2, alert: 'Lỗi Server 2' })
            }
        } catch (e) {
            this.setState({ status_Event: 1, alert: 'Lỗi Server 1' })
            console.log('Lỗi Server 1', e);
        }
    }
    render() {
        let status_Event = this.state.status_Event;
        return (
            <div>
                <Header />
                <Switch>
                    <Route exact path="/home"><Home /></Route>
                    {status_Event == 0 ?
                        <>
                            <Route exact path="/home/form"><Form /></Route>
                            <Route exact path="/home/checkout"><Checkout /></Route>
                        </>
                        :
                        <>
                            <Route exact path="/home/form"><Page_err_not_found /></Route>
                            <Route exact path="/home/checkout"><Page_err_not_found /></Route>
                        </>
                    }
                </Switch>
                <Footer />
            </div>
        );
    }

}
export default withRouter(index);
