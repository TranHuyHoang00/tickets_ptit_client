import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import { DatabaseOutlined, } from '@ant-design/icons';
import { Table, Space, Modal, Divider, Button, Input, Popconfirm, message } from 'antd';
import { AiFillEdit, AiFillDelete, AiFillEye } from "react-icons/ai";
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getListUser, createUser, getUser, deleteUser, editUser } from '../../../services/userService';
import { async } from 'q';
class user extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenFormCreate: false,
            isOpenFormDetail: false,
            isOpenFormEdit: false,
            dataUser: {},
            dataUsers: [],
            idUser: '',
        }
    }
    async componentDidMount() {
        await this.getListUser();
    }
    getListUser = async () => {
        try {
            let data = await getListUser();
            if (data && data.data && data.data.success == 1) {
                this.setState({ dataUsers: data.data.data })
            } else {
                this.setState({ dataUsers: {} })
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    getUser = async (id) => {
        try {
            let data = await getUser(id);
            if (data && data.data && data.data.success == 1) {
                this.setState({ dataUser: data.data.data })
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
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
    openForm = async (name, value, id) => {
        if (name == 'create') { this.setState({ isOpenFormCreate: value }) }
        if (name == 'detail') {
            if (id == null) {
                this.setState({ isOpenFormDetail: value });
            } else {
                this.setState({ isOpenFormDetail: value });
                await this.getUser(id);
            }
        }
        if (name == 'edit') {
            if (id == null) {
                this.setState({ isOpenFormEdit: value });
            } else {
                this.setState({ isOpenFormEdit: value, idUser: id });
                await this.getUser(id);
            }
        }
    }
    isCheckEmpty = (value) => {
        return value.trim().length
    }
    isCheckSpace = (value) => {
        return (/\s/).test(value);
    }
    Validation = (data) => {
        if (!data.username) {
            return { mess: "Thiếu tài khoản", code: 1 };
        }
        if (this.isCheckEmpty(data.username) == 0) {
            return { mess: "Thiếu tài khoản", code: 1 };
        }
        if (this.isCheckEmpty(data.username) < 5) {
            return { mess: "Tài khoản >4 kí tự", code: 1 };
        }
        if (this.isCheckSpace(data.username) == true) {
            return { mess: "Tài khoản chứa khoảng trắng", code: 1 };
        }
        for (const i of this.state.dataUsers) {
            if (i.username == data.username) {
                return { mess: "Tài khoản đã tồn tại", code: 1 };
            }
        }
        if (!data.password) {
            return { mess: "Thiếu mật khẩu", code: 1 };
        }
        if (this.isCheckEmpty(data.password) == 0) {
            return { mess: "Thiếu mật khẩu", code: 1 };
        }
        if (this.isCheckEmpty(data.password) < 9) {
            return { mess: "Mật khẩu phải lớn hơn 8 kí tự", code: 1 };
        }
        if (this.isCheckSpace(data.password) == true) {
            return { mess: "Mật khấu chứa khoảng trắng", code: 1 };
        }
        if (!data.password2) {
            return { mess: "Thiếu mật khẩu nhập lại", code: 1 };
        }
        if (this.isCheckEmpty(data.password2) == 0) {
            return { mess: "Thiếu mật khẩu 2", code: 1 };
        }
        if (this.isCheckEmpty(data.password2) < 9) {
            return { mess: "Mật khẩu phải lớn hơn 8 kí tự", code: 1 };
        }
        if (data.password !== data.password2) {
            return { mess: "Mật khẩu nhập lại sai", code: 1 };
        }
        if (this.isCheckSpace(data.password2) == true) {
            return { mess: "Mật khấu 2 chứa khoảng trắng", code: 1 };
        }
        if (!data.first_name) {
            return { mess: "Thiếu họ", code: 1 };
        }
        if (this.isCheckEmpty(data.first_name) == 0) {
            return { mess: "Thiếu họ", code: 1 };
        }
        if (!data.last_name) {
            return { mess: "Thiếu tên", code: 1 };
        }
        if (this.isCheckEmpty(data.last_name) == 0) {
            return { mess: "Thiếu tên", code: 1 };
        }
        return { code: 0 };
    }
    ValidationEdit = (data) => {
        if (this.isCheckEmpty(data.first_name) == 0) {
            return { mess: "Thiếu họ", code: 1 };
        }
        if (this.isCheckEmpty(data.last_name) == 0) {
            return { mess: "Thiếu tên", code: 1 };
        }
        return { code: 0 };
    }
    handleCreate = async () => {
        let result = this.Validation(this.state.dataUser);
        if (result.code == 0) {
            try {
                let data = await createUser(this.state.dataUser);
                if (data && data.data && data.data.success == 1) {
                    toast.success('Thành công')
                    await this.getListUser();
                    this.setState({ isOpenFormCreate: false })
                } else {
                    toast.error('Thông tin điền bị lỗi')
                }
            } catch (e) {
                toast.error('Lỗi hệ thống');
            }
        } else {
            toast.error(result.mess);
        }
    }
    handleEdit = async (id) => {
        let result = this.ValidationEdit(this.state.dataUser);
        if (result.code == 0) {
            try {
                let data = await editUser(id, this.state.dataUser);
                if (data && data.data && data.data.success == 1) {
                    toast.success('Thành công')
                    await this.getListUser();
                    this.setState({ isOpenFormEdit: false, dataUser: {} })
                } else {
                    toast.error('Tài khoản đã tồn tại')
                }
            } catch (e) {
                toast.error('Lỗi hệ thống');
            }
        } else {
            toast.error(result.mess);
        }
    }
    handleDelete = async (id) => {
        try {
            let data = await deleteUser(id);
            if (data && data.data && data.data.success == 1) {
                toast.success('Thành công')
                await this.getListUser();
            } else {
                toast.error('Thất bại')
            }
        } catch (e) {
            toast.error('Lỗi hệ thống');
        }
    }
    render() {
        let dataUser = this.state.dataUser;
        const columns = [
            {
                title: 'Id', dataIndex: 'id', responsive: ['md'], width: 100,
                sorter: (a, b) => a.id - b.id,
            },
            {
                title: 'Họ', dataIndex: 'first_name', responsive: ['md'],
                sorter: (a, b) => a.first_name.localeCompare(b.first_name),

            },
            {
                title: 'Tên', dataIndex: 'last_name', responsive: ['md'],
                sorter: (a, b) => a.last_name.localeCompare(b.last_name),
            },
            {
                title: 'Tài khoản', dataIndex: 'username',
                sorter: (a, b) => a.username.localeCompare(b.username),
            },
            {
                title: 'Hành động', width: 100,
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
                <Button size='small' onClick={() => this.openForm('create', true)} type='default' className='bg-black text-white'>Tạo mới</Button>
                <Divider>TÀI KHOẢN</Divider>
                <Table columns={columns} dataSource={this.state.dataUsers}
                    size="small" bordered
                    pagination={{ pageSize: 7, }}
                    scroll={{ y: 300, x: 300, }}
                />
                <Modal title="Tạo mới" open={this.state.isOpenFormCreate}
                    okText={'Xác nhận'} okType={'default'} cancelText={'Hủy bỏ'}
                    onOk={() => this.handleCreate()}
                    onCancel={() => this.openForm('create', false)}
                    width={300} >
                    <div className='space-y-[10px]'>
                        <div>
                            <label>Tài khoản<span className='text-red-500'> *</span></label>
                            <Input placeholder='Lớn hơn 4 kí tự'
                                onChange={(event) => this.handleOnchangeInput(event, 'username')} />
                        </div>
                        <div>
                            <label>Mật khẩu<span className='text-red-500'> *</span></label>
                            <Input.Password placeholder='Lớn hơn 8 và có kí tự đặc biệt'
                                onChange={(event) => this.handleOnchangeInput(event, 'password')} />
                        </div>
                        <div>
                            <label>Nhập lại mật khẩu<span className='text-red-500'> *</span></label>
                            <Input.Password placeholder='Lớn hơn 8 và có kí tự đặc biệt'
                                onChange={(event) => this.handleOnchangeInput(event, 'password2')} />
                        </div>
                        <div>
                            <label>Họ<span className='text-red-500'> *</span></label>
                            <Input placeholder='Huy'
                                onChange={(event) => this.handleOnchangeInput(event, 'first_name')} />
                        </div>
                        <div>
                            <label>Tên<span className='text-red-500'> *</span></label>
                            <Input placeholder='Hoàng'
                                onChange={(event) => this.handleOnchangeInput(event, 'last_name')} />
                        </div>
                    </div>
                </Modal>
                <Modal title="Chi tiết" open={this.state.isOpenFormDetail}
                    okText={'Xác nhận'} okType={'default'} cancelText={'Hủy bỏ'}
                    onOk={() => this.openForm('detail', false, null)}
                    onCancel={() => this.openForm('detail', false, null)}
                    width={300}
                >
                    <div className='space-y-[10px]'>
                        <div>
                            <label>Tài khoản<span className='text-red-500'> *</span></label>
                            <Input value={dataUser.username} />
                        </div>
                        <div>
                            <label>Họ<span className='text-red-500'> *</span></label>
                            <Input value={dataUser.first_name} />
                        </div>
                        <div>
                            <label>Tên<span className='text-red-500'> *</span></label>
                            <Input value={dataUser.last_name} />
                        </div>
                    </div>
                </Modal>
                <Modal title="Chỉnh sửa" open={this.state.isOpenFormEdit}
                    okText={'Xác nhận'} okType={'default'} cancelText={'Hủy bỏ'}
                    onOk={() => this.handleEdit(this.state.idUser)}
                    onCancel={() => this.openForm('edit', false, null)}
                    width={300}
                >
                    <div className='space-y-[10px]'>
                        <div>
                            <label>Tài khoản<span className='text-red-500'> *</span></label>
                            <Input value={dataUser.username}
                                onChange={(event) => this.handleOnchangeInput(event, 'username')} />
                        </div>
                        <div>
                            <label>Họ<span className='text-red-500'> *</span></label>
                            <Input value={dataUser.first_name}
                                onChange={(event) => this.handleOnchangeInput(event, 'first_name')} />
                        </div>
                        <div>
                            <label>Tên<span className='text-red-500'> *</span></label>
                            <Input value={dataUser.last_name}
                                onChange={(event) => this.handleOnchangeInput(event, 'last_name')} />
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }

}
export default withRouter(user);
