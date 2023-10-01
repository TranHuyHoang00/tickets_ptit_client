import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Input, } from 'antd';
import { handlelogin } from '../../services/eventService';
import { toast } from 'react-toastify';

class login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: {
                username: '',
                password: '',
            },
        }
    }
    async componentDidMount() {
    }
    handleOnchangeInput = (event, id) => {
        let copyState = { ...this.state.login };
        copyState[id] = event.target.value;
        this.setState({
            login: {
                ...copyState
            }
        });
    }
    isCheckEmpty = (value) => { return value.trim().length }
    isCheckSpace = (value) => { return (/\s/).test(value); }
    Validation = () => {
        let login = this.state.login;
        if (this.isCheckEmpty(login.username) == 0) {
            return { mess: "Thiếu tài khoản", code: 1 };
        }
        if (this.isCheckSpace(login.username) == true) {
            return { mess: "Tài khoản chứa khoảng trắng", code: 1 };
        }
        if (this.isCheckEmpty(login.password) == 0) {
            return { mess: "Thiếu mật khẩu", code: 1 };
        }
        if (this.isCheckSpace(login.password) == true) {
            return { mess: "Mật khẩu chứa khoảng trắng", code: 1 };
        }
        return { code: 0 };
    }
    handleLogin = async () => {
        let result = this.Validation();
        if (result.code == 0) {
            try {
                let data = await handlelogin(this.state.login);
                console.log('data', data);
            } catch (e) {
                console.log('Lỗi', e);
            }
        } else {
            toast.error(result.mess);
        }
    }
    render() {
        return (
            <div className='flex items-center justify-center h-screen w-screen p-[20px]'>
                <div className='space-y-[20px] border shadow-md p-[20px] rounded-[5px]'>
                    <div className='text-center font-[700] text-[24px]'>
                        <label>Admin</label>
                    </div>
                    <div>
                        <label>Tài khoản</label>
                        <Input placeholder='Admin'
                            onChange={(event) => this.handleOnchangeInput(event, 'username')} />
                    </div>
                    <div>
                        <label>Mật khẩu</label>
                        <Input.Password placeholder='12345'
                            onChange={(event) => this.handleOnchangeInput(event, 'password')} />
                    </div>
                    <div className='text-center '>
                        <Button onClick={() => this.handleLogin()}
                            type='default' className='bg-blue-500 text-white'>Đăng nhập</Button>
                    </div>
                </div>
            </div>
        );
    }

}
export default withRouter(login);
