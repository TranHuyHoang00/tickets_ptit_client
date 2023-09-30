import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import { DatabaseOutlined, } from '@ant-design/icons';
import { Layout, Menu, Table, Space, Modal, Divider, Button, Input, Checkbox, Form, Popconfirm } from 'antd';
import { AiFillEdit, AiFillDelete, AiFillEye, AiOutlinePlus } from "react-icons/ai";
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';

class event extends Component {
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
                    mssv: `N19DCCN065`,
                    ticket: `2`,
                },
                {
                    key: 1,
                    id: 2,
                    fullname: `Vũ Trung An`,
                    mssv: `N19DCCN003`,
                    ticket: `3`,
                },
                {
                    key: 1,
                    id: 3,
                    fullname: `Vũ Đức Hải`,
                    mssv: `N19DCCN024`,
                    ticket: `4`,
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
                title: 'Stt', dataIndex: 'id', width: 100, responsive: ['md'],
                sorter: (a, b) => a.id - b.id,
            },
            {
                title: 'Sự kiện', dataIndex: 'name',
                sorter: (a, b) => a.fullname.localeCompare(b.fullname),
            },
            {
                title: 'Trạng thái', dataIndex: 'mssv',
                sorter: (a, b) => a.mssv.localeCompare(b.mssv),
            },
            {
                title: 'Vé', dataIndex: 'ticket', width: 50,
                sorter: (a, b) => a.ticket - b.ticket,
            },
            {
                title: 'Hành động', width: 100,
                key: 'action',
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
            <div className='m-[10px] p-[10px] bevent shadow-md bg-white'>
                <Button onClick={() => this.openForm('create', true)} type='default' className='bg-black text-white'>Tạo mới</Button>
                <Divider>Giao dịch</Divider>
                <Table columns={columns} dataSource={this.state.dataUsers}
                    size="small" bevented
                    pagination={{ pageSize: 10, }}
                    scroll={{ y: 300, x: 300, }}
                />
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
            </div>
        );
    }

}
export default withRouter(event);
