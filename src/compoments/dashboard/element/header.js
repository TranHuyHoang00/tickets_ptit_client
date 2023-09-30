import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import { DatabaseOutlined, UserOutlined, CaretDownOutlined, SmileOutlined } from '@ant-design/icons';
import { Layout, Menu, Avatar, Dropdown, Space, Button } from 'antd';
import { AiOutlineAudit, AiOutlineUser, AiFillCalculator, AiFillContainer } from "react-icons/ai";
import { withRouter } from 'react-router-dom';


class header extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
    }
    render() {
        const items = [
            {
                key: '1',
                label: (
                    <a className='disabled'>Trần Huy Hoàng</a>

                ),
                disabled: true,
            },
            {
                key: '1',
                label: (
                    <a >Đăng xuất</a>
                ),
            },
        ];
        return (
            <div>
                <Dropdown menu={{ items, }}>
                    <Space>
                        <Avatar style={{ backgroundColor: '#87d068', }} icon={<UserOutlined />} />
                        <CaretDownOutlined />
                    </Space>
                </Dropdown>
            </div>
        );
    }

}
export default withRouter(header);
