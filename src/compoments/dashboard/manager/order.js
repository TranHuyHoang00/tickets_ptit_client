import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import { DatabaseOutlined, } from '@ant-design/icons';
import { Table, Space, Modal, Divider, Button, Input, Popconfirm, Select } from 'antd';
import { AiFillEdit, AiFillDelete, AiFillEye } from "react-icons/ai";
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getListOrder, getOrder } from '../../../services/eventService';
class order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenFormCreate: false,
            isOpenFormDetail: false,
            isOpenFormEdit: false,
            isOpenFormStatistic: false,
            dataOrder: {},
            dataOrders: [],
            idOrder: '',
            dataStatistic: {
                total_amount: 0,
                total_ticket: 0,
            }
        }
    }
    async componentDidMount() {
        await this.getListOrder();
    }
    onChange_payment_status = (value) => {
        this.Statistic(value);
    }
    Statistic = (value) => {
        let dataOrders = this.state.dataOrders;
        let ticket = 0;
        let amount = 0;
        for (const i of dataOrders) {
            if (i.payment_status == value) {
                ticket += i.ticket_quantity;
                amount += i.total_amount;
            }
        }
        let data = {};
        data.total_ticket = ticket;
        data.total_amount = amount;
        this.setState({ dataStatistic: data })
    }
    getListOrder = async () => {
        try {
            let data = await getListOrder();
            if (data && data.data && data.data.success == 1) {
                this.setState({ dataOrders: data.data.data })
            } else {
                this.setState({ dataOrders: {} })
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    getOrder = async (id) => {
        try {
            let data = await getOrder(id);
            if (data && data.data && data.data.success == 1) {
                this.setState({ dataOrder: data.data.data })
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    handleOnchangeInput = (event, id) => {
        let copyState = { ...this.state.dataOrder };
        copyState[id] = event.target.value;
        this.setState({
            dataOrder: {
                ...copyState
            }
        });
    }
    openForm = async (name, value, id) => {
        if (name == 'create') { this.setState({ isOpenFormCreate: value }) }
        if (name == 'statistic') { this.setState({ isOpenFormCreate: value }) }
        if (name == 'detail') {
            if (id == null) {
                this.setState({ isOpenFormDetail: value });
            } else {
                this.setState({ isOpenFormDetail: value });
                await this.getOrder(id);
            }
        }
        if (name == 'edit') {
            if (id == null) {
                this.setState({ isOpenFormEdit: value });
            } else {
                this.setState({ isOpenFormEdit: value, idOrder: id });
                await this.getOrder(id);
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
        return { code: 0 };
    }
    ValidationEdit = (data) => {
        return { code: 0 };
    }
    handleCreate = async () => {
    }
    handleEdit = async (id) => {
    }
    handleDelete = async (id) => {
    }
    render() {
        let dataOrder = this.state.dataOrder;
        let dataStatistic = this.state.dataStatistic;
        const columns = [
            {
                title: 'Id', dataIndex: 'id', responsive: ['md'], width: 100,
                sorter: (a, b) => a.id - b.id,
            },
            {
                title: 'Tổng tiền', dataIndex: 'total_amount',
                sorter: (a, b) => a.total_amount - b.total_amount,

            },
            {
                title: 'Tổng vé', dataIndex: 'ticket_quantity',
                sorter: (a, b) => a.ticket_quantity - b.ticket_quantity,

            },
            {
                title: 'Trạng thái', dataIndex: 'payment_status',
                sorter: (a, b) => a.payment_status.localeCompare(b.payment_status),
            },
            {
                title: 'Hđ', width: 100,
                render: (_, record) => (
                    <Space size="small">
                        <a onClick={() => this.openForm('detail', true, record.id)}><AiFillEye /></a>
                        {/* <a onClick={() => this.openForm('edit', true, record.id)}><AiFillEdit /></a>
                        <Popconfirm title="Xóa ?" okType='default' onConfirm={() => this.handleDelete(record.id)}>
                            <a><AiFillDelete /></a>
                        </Popconfirm> */}
                    </Space>
                ),
            },
        ];
        return (
            <div className='m-[10px] p-[10px] border shadow-md bg-white'>
                <div className='flex items-center justify-between'>
                    <Button disabled size='small' onClick={() => this.openForm('create', true)} type='default' className='bg-black text-white'>Tạo mới</Button>
                    <Button size='small' onClick={() => this.openForm('statistic', true)} type='default' className='bg-black text-white'>Thống kê</Button>
                </div>
                <Divider>HÓA ĐƠN</Divider>
                <Table columns={columns} dataSource={this.state.dataOrders}
                    size="small" bordered
                    pagination={{ pageSize: 7, }}
                    scroll={{ y: 300, x: 300, }}
                />
                <Modal title="Tạo mới" open={this.state.isOpenFormCreate}
                    okText={'Xác nhận'} okType={'default'} cancelText={'Hủy bỏ'}
                    onOk={() => this.handleCreate()}
                    onCancel={() => this.openForm('create', false)}
                    width={300} >

                </Modal>
                <Modal title="Chi tiết" open={this.state.isOpenFormDetail}
                    okText={'Xác nhận'} okType={'default'} cancelText={'Hủy bỏ'}
                    onOk={() => this.openForm('detail', false, null)}
                    onCancel={() => this.openForm('detail', false, null)}
                    width={300}
                >
                    <div className='space-y-[10px]'>
                        <div className='border p-[10px] shadow-md rounded-[5px]'>
                            <div className='text-center font-[700]'><label>Sự kiện</label></div>
                            <div>
                                <label>Tên<span className='text-red-500'> *</span></label>
                                <Input value={dataOrder.event && dataOrder.event.event_name} />
                            </div>
                        </div>
                        <div className='border p-[10px] shadow-md rounded-[5px]'>
                            <div className='text-center font-[700]'><label>Người mua</label></div>
                            <div>
                                <label>Họ tên<span className='text-red-500'> *</span></label>
                                <Input value={dataOrder.buyer && dataOrder.buyer.full_name} />
                            </div>
                            <div>
                                <label>Mã sinh viên<span className='text-red-500'> *</span></label>
                                <Input value={dataOrder.buyer && dataOrder.buyer.student_id} />
                            </div>
                            <div>
                                <label>Số điện thoại<span className='text-red-500'> *</span></label>
                                <Input value={dataOrder.buyer && dataOrder.buyer.phone_number} />
                            </div>
                        </div>
                        <div className='border p-[10px] shadow-md rounded-[5px]'>
                            <div className='text-center font-[700]'><label>Hóa đơn</label></div>
                            <div>
                                <label>Mã hóa đơn<span className='text-red-500'> *</span></label>
                                <Input value={dataOrder.id} />
                            </div>
                            <div>
                                <label>Tổng vé<span className='text-red-500'> *</span></label>
                                <Input value={dataOrder.ticket_quantity} />
                            </div>
                            <div>
                                <label>Tổng tiền<span className='text-red-500'> *</span></label>
                                <Input value={dataOrder.total_amount} />
                            </div>
                            <div>
                                <label>Thanh toán<span className='text-red-500'> *</span></label>
                                <Input value={dataOrder.payment_method} />
                            </div>
                            <div>
                                <label>Trạng thái<span className='text-red-500'> *</span></label>
                                <Input value={dataOrder.payment_status} />
                            </div>
                            <div>
                                <label>Người bán<span className='text-red-500'> *</span></label>
                                <Input value={dataOrder.user && dataOrder.user.last_name} />
                            </div>
                            <div>
                                <label>Ngày tạo<span className='text-red-500'> *</span></label>
                                <Input value={dataOrder.created_at} />
                            </div>
                            <div>
                                <label>Ngày cập nhập<span className='text-red-500'> *</span></label>
                                <Input value={dataOrder.updated_at} />
                            </div>
                        </div>
                    </div>
                </Modal>
                <Modal title="Chỉnh sửa" open={this.state.isOpenFormEdit}
                    okText={'Xác nhận'} okType={'default'} cancelText={'Hủy bỏ'}
                    onOk={() => this.handleEdit(this.state.idOrder)}
                    onCancel={() => this.openForm('edit', false, null)}
                    width={300}
                >

                </Modal>
                <Modal title="Thống kê" open={this.state.isOpenFormCreate}
                    okText={'Xác nhận'} okType={'default'} cancelText={'Hủy bỏ'}
                    onOk={() => this.openForm('statistic', false)}
                    onCancel={() => this.openForm('statistic', false)}
                    width={300} >
                    <div className='space-y-[10px]'>
                        <div className='text-center font-[700]'>
                            <Select defaultValue="Trạng thái"
                                style={{ width: 120, }}
                                onChange={(value) => this.onChange_payment_status(value)}
                                options={[
                                    {
                                        value: 'success',
                                        label: 'Thành công',
                                    },
                                    {
                                        value: 'pending',
                                        label: 'Đang chờ',
                                    },
                                ]}
                            />
                        </div>
                        <div className='border p-[10px] shadow-md rounded-[5px] space-y-[20px]'>
                            <div className='text-center'>
                                <label className='font-[600]'>Tổng hóa đơn</label><br />
                                <label className='text-red-500'>{dataStatistic.total_ticket} cái</label>
                            </div>
                            <div className='text-center'>
                                <label className='font-[600]'>Tổng tiền</label><br />
                                <label className='text-red-500'>{`${dataStatistic.total_amount}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} vnđ</label>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }

}
export default withRouter(order);
