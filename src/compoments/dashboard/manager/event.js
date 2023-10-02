import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import { DatabaseOutlined, } from '@ant-design/icons';
import { DatePicker, Table, Space, Modal, Divider, Button, Input, Select, Form, Popconfirm } from 'antd';
import { AiFillEdit, AiFillDelete, AiFillEye, AiOutlinePlus } from "react-icons/ai";
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getListEvent, getEvent, editEvent } from '../../../services/eventService';
class event extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenFormCreate: false,
            isOpenFormDetail: false,
            isOpenFormEdit: false,
            dataEvent: {},
            dataEvents: []
        }
    }
    async componentDidMount() {
        await this.getListEvent();
    }
    getListEvent = async () => {
        try {
            let data = await getListEvent();
            if (data && data.data && data.data.success == 1) {
                this.setState({ dataEvents: data.data.data })
            } else {
                this.setState({ dataEvents: {} })
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    getEvent = async (id) => {
        try {
            let data = await getEvent(id);
            if (data && data.data && data.data.success == 1) {
                this.setState({ dataEvent: data.data.data })
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    handleOnchangeInput = (event, id) => {
        let copyState = { ...this.state.dataEvent };
        copyState[id] = event.target.value;
        this.setState({
            dataEvent: {
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
                await this.getEvent(id);
            }
        }
        if (name == 'edit') {
            if (id == null) {
                this.setState({ isOpenFormEdit: value });
            } else {
                this.setState({ isOpenFormEdit: value, idUser: id });
                await this.getEvent(id);
            }
        }
    }
    isCheckEmpty = (value) => { return value.trim().length }
    isCheckSpace = (value) => { return (/\s/).test(value); }
    Validation = (data) => {
        return { code: 0 };
    }
    ValidationEdit = (data) => {
        if (this.isCheckEmpty(data.event_name) == 0) {
            return { mess: "Thiếu tên sự kiện", code: 1 };
        }
        if (this.isCheckEmpty(data.expiry_date) == 0) {
            return { mess: "Thiếu ngày kết thúc", code: 1 };
        }
        return { code: 0 };
    }
    handleCreate = async () => {
    }
    handleEdit = async (id) => {
        console.log(this.state.dataEvent);
        let result = this.ValidationEdit(this.state.dataEvent);
        if (result.code == 0) {
            try {
                let data = await editEvent(id, this.state.dataEvent);
                if (data && data.data && data.data.success == 1) {
                    toast.success('Thành công')
                    await this.getListEvent();
                    this.setState({ isOpenFormEdit: false })
                } else {
                    toast.error('Sửa thất bại')
                }
            } catch (e) {
                toast.error('Lỗi hệ thống');
            }
        } else {
            toast.error(result.mess);
        }
    }
    handleDelete = async (id) => {
    }
    render() {
        let dataEvent = this.state.dataEvent;
        const columns = [
            {
                title: 'Stt', dataIndex: 'id', responsive: ['md'], width: 100,
                sorter: (a, b) => a.id - b.id,
            },
            {
                title: 'Mã Code', dataIndex: 'event_code', responsive: ['md'],
            },
            {
                title: 'Tên', dataIndex: 'event_name',
                sorter: (a, b) => a.username.localeCompare(b.username),
            },
            {
                title: 'Ngày kết thúc', dataIndex: 'expiry_date', responsive: ['md'],
            },
            {
                title: 'Hành động', width: 120,
                render: (_, record) => (
                    <Space size="small">
                        <a onClick={() => this.openForm('detail', true, record.event_code)}><AiFillEye /></a>
                        <a onClick={() => this.openForm('edit', true, record.event_code)}><AiFillEdit /></a>
                        {/* <Popconfirm title="Xóa ?" okType='default' onConfirm={() => this.handleDelete(record.event_code)}>
                            <a><AiFillDelete /></a>
                        </Popconfirm> */}
                    </Space>
                ),
            },
        ];
        return (
            <div className='m-[10px] p-[10px] border shadow-md bg-white'>
                <Button disabled size='small' onClick={() => this.openForm('create', true)} type='default' className='bg-black text-white'>Tạo mới</Button>
                <Divider>SỰ KIỆN</Divider>
                <Table columns={columns} dataSource={this.state.dataEvents}
                    size="small" bordered
                    pagination={{ pageSize: 10, }}
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
                            <label>Mã Code<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.event_code} />
                        </div>
                        <div>
                            <label>Sự kiện<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.event_name} />
                        </div>
                        <div>
                            <label>Ngày kết thúc<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.expiry_date} />
                        </div>
                        <div>
                            <label>Trạng thái<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.is_activate} />
                        </div>
                        <div>
                            <label>Giá vé<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.ticket_price} />
                        </div>
                        <div>
                            <label>Tổng vé<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.total_ticket} />
                        </div>
                        <div>
                            <label>Vé đã bán<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.total_ticket - dataEvent.avaliable_ticket} />
                        </div>
                        <div>
                            <label>Vé vé còn lại<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.avaliable_ticket} />
                        </div>

                        <div>
                            <label>Ngày tạo<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.created_at} />
                        </div>
                        <div>
                            <label>Ngày cập nhập<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.updated_at} />
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
                            <label>Mã Code<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.event_code} disabled />
                        </div>
                        <div>
                            <label>Sự kiện<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.event_name}
                                onChange={(event) => this.handleOnchangeInput(event, 'event_name')} />
                        </div>
                        <div>
                            <label>Ngày kết thúc<span className='text-red-500'> *</span></label><br />
                            <input className='border w-full p-[5px] rounded-[5px]'
                                type='date' value={dataEvent.expiry_date}
                                onChange={(event) => this.handleOnchangeInput(event, 'expiry_date')} />
                        </div>
                        <div>
                            <label>Trạng thái<span className='text-red-500'> *</span></label><br />
                            <select value={dataEvent.is_activate} className='border w-full p-[5px] rounded-[5px]'
                                onChange={(event) => this.handleOnchangeInput(event, 'is_activate')}>
                                <option value={true}>Mở</option>
                                <option value={false}>Đóng</option>
                            </select>

                        </div>
                        <div>
                            <label>Giá vé<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.ticket_price}
                                onChange={(event) => this.handleOnchangeInput(event, 'ticket_price')} />
                        </div>
                        <div>
                            <label>Tổng vé<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.total_ticket}
                                onChange={(event) => this.handleOnchangeInput(event, 'total_ticket')} />
                        </div>
                        <div>
                            <label>Vé đã bán<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.total_ticket - dataEvent.avaliable_ticket} disabled />
                        </div>
                        <div>
                            <label>Vé vé còn lại<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.avaliable_ticket} disabled />
                        </div>

                        <div>
                            <label>Ngày tạo<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.created_at} disabled />
                        </div>
                        <div>
                            <label>Ngày cập nhập<span className='text-red-500'> *</span></label>
                            <Input value={dataEvent.updated_at} disabled />
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }

}
export default withRouter(event);
