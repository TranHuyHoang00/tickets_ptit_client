import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import { DatabaseOutlined, } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { AiOutlineAudit, AiOutlineUser, AiFillCalculator, AiFillContainer, AiFillAppstore } from "react-icons/ai";
import { withRouter } from 'react-router-dom';
import HeaderDB from './element/header';
import ManagerUser from './manager/user';
import ManagerOrder from './manager/order';
import MangerEvent from './manager/event';
import Function from './function/functions';
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            url: '/dashboard/',
        }
    }
    async componentDidMount() {


    }
    getItem = (label, key, icon, children, type) => {

        return { key, icon, children, label, type };
    }
    setCollapsed = () => { this.setState({ collapsed: !this.state.collapsed }) }
    onClickPage = (value) => {
        this.props.history.push(`/dashboard/${value.key}`)
    }
    render() {
        const items = [
            this.getItem('Quản lý', 'table', <DatabaseOutlined />, [
                this.getItem('Người dùng', 'user', <AiOutlineUser />),
                this.getItem('Giao dịch', 'order', <AiFillContainer />),
                this.getItem('Sự kiện', 'event', <AiOutlineAudit />),
            ]),
            this.getItem('Chức năng', 'function', <AiFillCalculator />),
        ];
        const items1 = [
            this.getItem('Menu', 'menu', <AiFillAppstore />, [
                this.getItem('Quản lý', 'table', <DatabaseOutlined />, [
                    this.getItem('Người dùng', 'user', <AiOutlineUser />),
                    this.getItem('Giao dịch', 'order', <AiFillContainer />),
                    this.getItem('Sự kiện', 'event', <AiOutlineAudit />),
                ], 'group'),
                this.getItem('Chức năng', 'function', <AiFillCalculator />),
            ]),
        ];
        const { Header, Content, Footer, Sider } = Layout;
        let url = this.state.url;

        return (
            <Layout style={{ minHeight: '100vh', }} >
                <Sider className='sm:block hidden'
                    collapsible collapsed={this.state.collapsed} onCollapse={(value) => this.setCollapsed(value)}>
                    <Menu theme="dark" mode="inline" items={items} defaultSelectedKeys={['table']}
                        onClick={(value) => this.onClickPage(value)} />
                </Sider>
                <Layout>
                    <Header className='bg-white shadow-md flex items-center justify-between'>
                        <div>
                            <Menu mode="horizontal" items={items1} defaultSelectedKeys={['menu']}
                                onClick={(value) => this.onClickPage(value)} />
                        </div>
                        <HeaderDB />
                    </Header>
                    <Content className='py-[10px]'>
                        <Switch>
                            <Route exact path={`${url}user`}><ManagerUser /></Route>
                            <Route exact path={`${url}order`}><ManagerOrder /></Route>
                            <Route exact path={`${url}event`}><MangerEvent /></Route>
                            <Route exact path={`${url}function`}><Function /></Route>
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        );
    }

}
export default withRouter(index);
