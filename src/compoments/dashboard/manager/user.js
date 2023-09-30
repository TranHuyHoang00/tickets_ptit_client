import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import { DatabaseOutlined, } from '@ant-design/icons';
import { Layout, Menu, Table, Space, Modal, Divider, Button, Input, Checkbox, Form, Popconfirm } from 'antd';
import { AiFillEdit, AiFillDelete, AiFillEye, AiOutlinePlus } from "react-icons/ai";
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
class user extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenFormCreate: false,
            isOpenFormDetail: false,
            isOpenFormEdit: false,
            dataUser: {},
            dataUsers: [
                {
                    key: 1,
                    id: 1,
                    fullname: `Trần Huy Hoàng`,
                    username: `huyhoang`,
                    password: `12345`,
                },
                {
                    key: 1,
                    id: 2,
                    fullname: `Vũ Trung An`,
                    username: `trungan`,
                    password: `12345`,
                },
                {
                    key: 1,
                    id: 3,
                    fullname: `Vũ Đức Hải`,
                    username: `duchai`,
                    password: `12345`,
                }
            ]
        }
    }
    async componentDidMount() {
    }
    handleOnchangeInput = (event, id) => {
        let copyState = { ...this.state.dataUser };
        copyState[id] = event.target.value;
        this.setState({
            dataUser: {
                ...copyState
            }
        });
    }
    openForm = (name, value, id) => {
        let dataUsers = this.state.dataUsers;
        if (name == 'create') { this.setState({ isOpenFormCreate: value }) }
        if (name == 'detail') {
            if (id == null) {
                this.setState({ isOpenFormDetail: value })
            } else {
                var dataUser = dataUsers.find(dataUsers => dataUsers.id === id)
                this.setState({ isOpenFormDetail: value, dataUser: dataUser })
            }
        }
        if (name == 'edit') {
            if (id == null) {
                this.setState({ isOpenFormEdit: value })
            } else {
                var dataUser = dataUsers.find(dataUsers => dataUsers.id === id)
                this.setState({ isOpenFormEdit: value, dataUser: dataUser })
            }
        }
    }
    isCheckEmpty = (value) => { return value.trim().length }
    isCheckSpace = (value) => { return (/\s/).test(value); }
    Validation = (data) => {
        if (this.isCheckEmpty(data.fullname) == 0) {
            return { mess: "Thiếu họ và tên", code: 1 };
        }
        if (this.isCheckEmpty(data.username) == 0) {
            return { mess: "Thiếu tài khoản", code: 1 };
        }
        if (this.isCheckSpace(data.username) == true) {
            return { mess: "Tài khoản chứa khoảng trắng", code: 1 };
        }
        if (this.isCheckEmpty(data.password) == 0) {
            return { mess: "Thiếu mật khẩu", code: 1 };
        }
        if (this.isCheckSpace(data.password) == true) {
            return { mess: "Mật khấu chứa khoảng trắng", code: 1 };
        }
        return { code: 0 };
    }
    handleCreate = async () => {
        let result = this.Validation(this.state.dataUser);
        if (result.code == 0) {
            alert('Ok')
        } else {
            toast.error(result.mess);
        }
    }
    handleEdit = async () => {
        let result = this.Validation(this.state.dataUser);
        if (result.code == 0) {
            alert('Ok')
        } else {
            toast.error(result.mess);
        }
    }
    handleDelete = (id) => {
        alert(id)
    }
    render() {
        let dataUser = this.state.dataUser;
        const columns = [
            {
                title: 'Stt', dataIndex: 'id', responsive: ['md'], width: 100,
                sorter: (a, b) => a.id - b.id,
            },
            {
                title: 'Tên', dataIndex: 'fullname', responsive: ['md'],
                sorter: (a, b) => a.fullname.localeCompare(b.fullname),
            },
            {
                title: 'Tài khoản', dataIndex: 'username',
                sorter: (a, b) => a.username.localeCompare(b.username),
            },
            {
                title: 'Hành động', width: 120,
                render: (_, record) => (
                    <Space size="small">
                        <a onClick={() => this.openForm('detail', true, record.id)}><AiFillEye /></a>
                        <a onClick={() => this.openForm('edit', true, record.id)}><AiFillEdit /></a>
                        <Popconfirm title="Xóa ?" okType='default' onConfirm={() => this.handleDelete(record.id)}>
                            <a><AiFillDelete /></a>
                        </Popconfirm>
                    </Space>
                ),
            },
        ];
        return (
            <div className='m-[10px] p-[10px] border shadow-md bg-white'>
                <Button onClick={() => this.openForm('create', true)} type='default' className='bg-black text-white'>Tạo mới</Button>
                <Divider>Người dùng</Divider>
                <Table columns={columns} dataSource={this.state.dataUsers}
                    size="small" bordered
                    pagination={{ pageSize: 10, }}
                    scroll={{ y: 300, x: 300, }}
                />
                {/* Create */}
                <Modal title="Tạo mới" open={this.state.isOpenFormCreate}
                    okText={'Xác nhận'} okType={'default'} cancelText={'Hủy bỏ'}
                    onOk={() => this.handleCreate()}
                    onCancel={() => this.openForm('create', false)}
                    width={300}
                >
                    <div className='space-y-[10px]'>
                        <div>
                            <label>Họ và tên<span className='text-red-500'> *</span></label>
                            <Input placeholder='Trần Huy Hoàng'
                                onChange={(event) => this.handleOnchangeInput(event, 'fullname')} />
                        </div>
                        <div>
                            <label>Tài khoản<span className='text-red-500'> *</span></label>
                            <Input placeholder='Admin1'
                                onChange={(event) => this.handleOnchangeInput(event, 'username')} />
                        </div>
                        <div>
                            <label>Mật khẩu<span className='text-red-500'> *</span></label>
                            <Input.Password placeholder='12345'
                                onChange={(event) => this.handleOnchangeInput(event, 'password')} />
                        </div>
                    </div>
                </Modal>
                {/* Detail */}
                <Modal title="Chi tiết" open={this.state.isOpenFormDetail}
                    okText={'Xác nhận'} okType={'default'} cancelText={'Hủy bỏ'}
                    onOk={() => this.openForm('detail', false)}
                    onCancel={() => this.openForm('detail', false)}
                    width={300}
                >
                    <div className='space-y-[10px]'>
                        <div>
                            <label>Họ và tên</label>
                            <Input placeholder='Trần Huy Hoàng' value={dataUser.fullname} />
                        </div>
                        <div>
                            <label>Tài khoản</label>
                            <Input placeholder='Admin1' value={dataUser.username} />
                        </div>
                        <div>
                            <label>Mật khẩu</label>
                            <Input.Password placeholder='12345' value={dataUser.password} />
                        </div>
                    </div>
                </Modal>
                {/* Edit */}
                <Modal title="Chỉnh sửa" open={this.state.isOpenFormEdit}
                    okText={'Xác nhận'} okType={'default'} cancelText={'Hủy bỏ'}
                    onOk={() => this.handleEdit()}
                    onCancel={() => this.openForm('edit', false)}
                    width={300}
                >
                    <div className='space-y-[10px]'>
                        <div>
                            <label>Họ và tên</label>
                            <Input placeholder='Trần Huy Hoàng' value={dataUser.fullname}
                                onChange={(event) => this.handleOnchangeInput(event, 'fullname')} />
                        </div>
                        <div>
                            <label>Tài khoản</label>
                            <Input placeholder='Admin1' value={dataUser.username}
                                onChange={(event) => this.handleOnchangeInput(event, 'username')} />
                        </div>
                        <div>
                            <label>Mật khẩu</label>
                            <Input.Password placeholder='12345' value={dataUser.password}
                                onChange={(event) => this.handleOnchangeInput(event, 'password')} />
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }

}
export default withRouter(user);
