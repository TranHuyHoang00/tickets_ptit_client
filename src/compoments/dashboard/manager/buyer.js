import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import { DatabaseOutlined, } from '@ant-design/icons';
import { Table, Space, Modal, Divider, Button, Input, Popconfirm, AutoComplete, ConfigProvider } from 'antd';
import { AiFillEdit, AiFillDelete, AiFillEye } from "react-icons/ai";
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getListBuyer, getBuyer } from '../../../services/eventService';
import { CloseSquareFilled, DeleteOutlined } from '@ant-design/icons';

class buyer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenFormCreate: false,
            isOpenFormDetail: false,
            isOpenFormEdit: false,
            dataBuyer: {},
            dataBuyers: [],
            idBuyer: '',
            dataSearch: [],
        }
    }
    async componentDidMount() {
        await this.getListBuyer();
    }
    getListBuyer = async () => {
        try {
            let data = await getListBuyer();
            if (data && data.data && data.data.success == 1) {
                let dataRaw = data.data.data;
                let dataFilter = [];
                for (const i of dataRaw) {
                    const obj = {};
                    obj.key = i.id;
                    obj.value = i.full_name;
                    dataFilter.push(obj);
                }
                this.setState({ dataBuyers: data.data.data, dataSearch: dataFilter })
            } else {
                this.setState({ dataBuyers: {} })
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    getBuyer = async (id) => {
        try {
            let data = await getBuyer(id);
            if (data && data.data && data.data.success == 1) {
                this.setState({ dataBuyer: data.data.data })
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    handleOnchangeInput = (event, id) => {
        let copyState = { ...this.state.dataBuyer };
        copyState[id] = event.target.value;
        this.setState({
            dataBuyer: {
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
                await this.getBuyer(id);
            }
        }
        if (name == 'edit') {
            if (id == null) {
                this.setState({ isOpenFormEdit: value });
            } else {
                this.setState({ isOpenFormEdit: value, idBuyer: id });
                await this.getBuyer(id);
            }
        }
    }
    isCheckEmpty = (value) => { return value.trim().length }
    isCheckSpace = (value) => { return (/\s/).test(value); }
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
    onSelect = async (value, option) => {
        await this.getListBuyer();
        let dataBuyers = this.state.dataBuyers;
        let result = dataBuyers.filter(obj => {
            return obj.id === option.key
        })
        this.setState({ dataBuyers: result })
    }
    onClearAutoComplete = async () => {
        await this.getListBuyer()
    }
    render() {
        let dataBuyer = this.state.dataBuyer;
        const columns = [
            {
                title: 'Id', dataIndex: 'id', responsive: ['md'], width: 100,
                sorter: (a, b) => a.id - b.id,
            },
            {
                title: 'Tên', dataIndex: 'full_name',
                sorter: (a, b) => a.full_name.localeCompare(b.full_name),
            },
            {
                title: 'Sđt', dataIndex: 'phone_number', responsive: ['md'],
                sorter: (a, b) => a.phone_number.localeCompare(b.phone_number),

            },
            {
                title: 'Mssv', dataIndex: 'student_id', responsive: ['md'],
                sorter: (a, b) => a.student_id.localeCompare(b.student_id),
            },
            {
                title: 'Hđ', width: 100,
                render: (_, record) => (
                    <Space size="small" >
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
            <>
                <div className='m-[10px] p-[10px] border shadow-md bg-white'>
                    <div className='flex items-center justify-between'>
                        <Button disabled size='small' onClick={() => this.openForm('create', true)} type='default' className='bg-black text-white'>Tạo mới</Button>
                        <AutoComplete className='md:w-[300px] w-[200px]'
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
                    <Divider>NGƯỜI MUA</Divider>
                    <Table columns={columns} dataSource={this.state.dataBuyers}
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
                                <label>Họ tên<span className='text-red-500'> *</span></label>
                                <Input />
                            </div>
                            <div>
                                <label>Mã sinh viên<span className='text-red-500'> *</span></label>
                                <Input />
                            </div>
                            <div>
                                <label>Số điện thoại<span className='text-red-500'> *</span></label>
                                <Input />
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
                                <label>Id<span className='text-red-500'> *</span></label>
                                <Input value={dataBuyer.id} />
                            </div>
                            <div>
                                <label>Họ tên<span className='text-red-500'> *</span></label>
                                <Input value={dataBuyer.full_name} />
                            </div>
                            <div>
                                <label>Mã sinh viên<span className='text-red-500'> *</span></label>
                                <Input value={dataBuyer.student_id} />
                            </div>
                            <div>
                                <label>Email<span className='text-red-500'> *</span></label>
                                <Input value={dataBuyer.email} />
                            </div>
                            <div>
                                <label>Số điện thoại<span className='text-red-500'> *</span></label>
                                <Input value={dataBuyer.phone_number} />
                            </div>
                            <div>
                                <label>Ngày tạo<span className='text-red-500'> *</span></label>
                                <Input value={dataBuyer.created_at} />
                            </div>
                            <div>
                                <label>Ngày cập nhập<span className='text-red-500'> *</span></label>
                                <Input value={dataBuyer.updated_at} />
                            </div>
                        </div>
                    </Modal>
                    <Modal title="Chỉnh sửa" open={this.state.isOpenFormEdit}
                        okText={'Xác nhận'} okType={'default'} cancelText={'Hủy bỏ'}
                        onOk={() => this.handleEdit(this.state.idBuyer)}
                        onCancel={() => this.openForm('edit', false, null)}
                        width={300}
                    >
                        <div className='space-y-[10px]'>
                            <div className='space-y-[10px]'>
                                <div>
                                    <label>Id<span className='text-red-500'> *</span></label>
                                    <Input value={dataBuyer.id} disabled />
                                </div>
                                <div>
                                    <label>Họ tên<span className='text-red-500'> *</span></label>
                                    <Input value={dataBuyer.full_name} />
                                </div>
                                <div>
                                    <label>Mã sinh viên<span className='text-red-500'> *</span></label>
                                    <Input value={dataBuyer.student_id} />
                                </div>
                                <div>
                                    <label>Email<span className='text-red-500'> *</span></label>
                                    <Input value={dataBuyer.email} disabled />
                                </div>
                                <div>
                                    <label>Số điện thoại<span className='text-red-500'> *</span></label>
                                    <Input value={dataBuyer.phone_number} />
                                </div>
                                <div>
                                    <label>Ngày tạo<span className='text-red-500'> *</span></label>
                                    <Input value={dataBuyer.created_at} disabled />
                                </div>
                                <div>
                                    <label>Ngày cập nhập<span className='text-red-500'> *</span></label>
                                    <Input value={dataBuyer.updated_at} disabled />
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </>
        );
    }

}
export default withRouter(buyer);
