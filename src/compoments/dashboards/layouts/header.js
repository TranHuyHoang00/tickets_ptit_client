import React, { Component } from 'react';
import { UserOutlined, CaretDownOutlined, } from '@ant-design/icons';
import { Avatar, Dropdown, Space } from 'antd';
import { withRouter } from 'react-router-dom';
import { Get_Local_Acount_DB, Remove_Local_Acount_DB } from '../../../auths/local_storage';

class header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataAcount: {},
        }
    }
    async componentDidMount() {
        let dataLogin = Get_Local_Acount_DB();
        if (dataLogin && dataLogin.data && dataLogin.data.access) {
            this.setState({ dataAcount: dataLogin.data.user })
        } else { this.setState({ dataAcount: {} }) }
    }
    LogOut = () => {
        Remove_Local_Acount_DB();
        this.props.history.push(`/login`);
    }
    render() {
        let dataAcount = this.state.dataAcount;
        const items = [
            {
                key: '1',
                label: (
                    <a className='disabled'>{dataAcount.last_name}</a>
                ),
                disabled: true,
            },
            {
                key: '1',
                label: (
                    <a onClick={() => this.LogOut()}>Đăng xuất</a>
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
