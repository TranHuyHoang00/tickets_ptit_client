import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import Form from '../compoments/user/form';
import Checkout from '../compoments/user/checkout';
import Home from '../compoments/user/home';
import Dashboard from '../compoments/dashboard/index';
import { getEvent } from './../services/eventService';

class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: 'Lỗi',
            statusEvent: 1,
            dataEvent: {},
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
                    statusEvent: 2,
                })
            }
            if (DateNow < expiry_date) {
                this.setState({
                    alert: 'Sự kiện đang mở',
                    statusEvent: 0,
                })
            }
        } else {
            this.setState({
                alert: 'Sự kiện đang đóng',
                statusEvent: 1,
            })
        }
    }
    getEvent = async () => {
        try {
            let data = await getEvent();
            if (data && data.data && data.data.success == 1) {
                this.checkEvent(data.data.data);
                this.setState({ dataEvent: data.data.data })
            } else {
                return this.setState({ dataEvent: {} })
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    render() {
        let statusEvent = this.state.statusEvent;
        return (
            <div>
                <Switch>
                    <Route exact path="/"><Home /></Route>
                    {statusEvent == 0 &&
                        <>
                            <Route path="/form"><Form /></Route>
                            <Route path="/checkout"><Checkout /></Route>
                        </>
                    }
                    <Route path="/dashboard"><Dashboard /></Route>
                </Switch>
            </div>
        );
    }

}
export default withRouter(index);
