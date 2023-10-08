import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import { DatabaseOutlined, } from '@ant-design/icons';
import { Table, Space, Modal, Divider, Button, Input, Popconfirm, Select, AutoComplete } from 'antd';
import { AiFillEdit, AiFillDelete, AiFillEye } from "react-icons/ai";
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getListTicket } from '../../../services/eventService';
class ticket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenFormCreate: false,
            isOpenFormDetail: false,
            isOpenFormEdit: false,
            dataTickets: [],
            dataTicket: {},
            dataSearch: [],
        }
    }
    async componentDidMount() {
        await this.getListTicket();
    }
    onSelect = async (value, option) => {
        await this.getListTicket();
        let dataTickets = this.state.dataTickets;
        let dataFilter = [];
        for (const i of dataTickets) {
            if (i && i.student && i.student.id == option.key) {
                dataFilter.push(i);
            }
        }
        this.setState({ dataTickets: dataFilter })
    }
    onClearAutoComplete = async () => {
        await this.getListTicket();
    }
    getListTicket = async () => {
        try {
            let data = await getListTicket();
            if (data && data.data && data.data.success == 1) {
                let dataRaw = data.data.data;
                let dataFilter = [];
                for (const i of dataRaw) {
                    if (i.student !== null) {
                        const obj = {};
                        obj.key = i.student.id;
                        obj.value = i.student.full_name;
                        dataFilter.push(obj);
                    }
                }
                this.setState({ dataTickets: data.data.data, dataSearch: dataFilter })
            } else {
                this.setState({ dataTickets: {} })
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    handleOnchangeInput = (event, id) => {
        let copyState = { ...this.state.dataTicket };
        copyState[id] = event.target.value;
        this.setState({
            dataTicket: {
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
                let dataTickets = this.state.dataTickets;
                let result = dataTickets.find(obj => {
                    return obj.id === id
                })
                this.setState({ isOpenFormDetail: value, dataTicket: result });
            }
        }
        if (name == 'edit') {
            if (id == null) {
                this.setState({ isOpenFormEdit: value });
            } else {
                this.setState({ isOpenFormEdit: value, idOrder: id });
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
    filterTicket = async (event) => {
        if (event == 0) { await this.getListTicket() }
        if (event == 1) {
            await this.getListTicket();
            let dataTickets = this.state.dataTickets;
            let result = dataTickets.filter(obj => {
                return obj.student !== null
            })
            this.setState({ dataTickets: result })
        }
        if (event == 2) {
            await this.getListTicket();
            let dataTickets = this.state.dataTickets;
            let result = dataTickets.filter(obj => {
                return obj.student === null
            })
            this.setState({ dataTickets: result })
        }
    }
    render() {
        let dataTicket = this.state.dataTicket;
        const columns = [
            {
                title: 'Id', dataIndex: 'id', responsive: ['md'], width: 100,
                sorter: (a, b) => a.id - b.id,
            },
            {
                title: 'Mã Code', dataIndex: 'ticket_code',
                sorter: (a, b) => a.ticket_code.localeCompare(b.ticket_code),
            },
            {
                title: 'Qua cổng', dataIndex: 'student',
                render: (student) => <a>{student == null ? 'Chưa' : 'Rồi'}</a>,
            },
            {
                title: 'Ngày cập nhập', dataIndex: 'updated_at',
                sorter: (a, b) => a.updated_at.localeCompare(b.updated_at),
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
                <div className='flex items-center justify-between space-x-[5px]'>
                    <Select defaultValue="0" style={{ width: 140, }}
                        onChange={(event) => this.filterTicket(event)}
                        options={[
                            { value: '0', label: 'Tất cả', },
                            { value: '1', label: 'Đã qua cổng', },
                            { value: '2', label: 'Chưa qua cổng', },
                        ]}
                    />
                    <AutoComplete className='md:w-[300px] w-[160px]'
                        options={this.state.dataSearch}
                        onSelect={(value, option) => this.onSelect(value, option)}
                        placeholder="Tìm tên"
                        filterOption={(inputValue, option) =>
                            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                        onClear={() => this.onClearAutoComplete()}
                        allowClear
                    />
                </div>
                <Divider>VÉ</Divider>
                <Table columns={columns} dataSource={this.state.dataTickets}
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
                                <Input value={dataTicket.event && dataTicket.event.event_name} />
                            </div>
                        </div>
                        <div className='border p-[10px] shadow-md rounded-[5px]'>
                            <div className='text-center font-[700]'><label>Sinh viên</label></div>
                            <div>
                                <label>Họ tên<span className='text-red-500'> *</span></label>
                                <Input value={dataTicket.student && dataTicket.student.full_name} />
                            </div>
                            <div>
                                <label>Mã sinh viên<span className='text-red-500'> *</span></label>
                                <Input value={dataTicket.student && dataTicket.student.student_id} />
                            </div>
                            <div>
                                <label>Căn cước<span className='text-red-500'> *</span></label>
                                <Input value={dataTicket.student && dataTicket.student.cccd} />
                            </div>
                        </div>
                        <div className='border p-[10px] shadow-md rounded-[5px]'>
                            <div className='text-center font-[700]'><label>Vé</label></div>
                            <div>
                                <label>Mã vé<span className='text-red-500'> *</span></label>
                                <Input value={dataTicket.ticket_code} />
                            </div>
                            <div>
                                <label>Ngày tạo<span className='text-red-500'> *</span></label>
                                <Input value={dataTicket.created_at} />
                            </div>
                            <div>
                                <label>Ngày cập nhập<span className='text-red-500'> *</span></label>
                                <Input value={dataTicket.updated_at} />
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

            </div>
        );
    }

}
export default withRouter(ticket);
