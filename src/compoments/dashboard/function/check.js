import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import { ScanOutlined, UserOutlined, CaretDownOutlined, SmileOutlined } from '@ant-design/icons';
import { Space, Button, Modal, Alert, Divider } from 'antd';
import { withRouter } from 'react-router-dom';
import { AiOutlineScan } from "react-icons/ai";
import { QrReader } from 'react-qr-reader';
import { getTicket } from '../../../services/eventService';

class check extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenFormCheck: false,
            delay: 500,
            resultQR: false,
            statusCheck: 0,
            dataTicket: {},
        }
    }
    async componentDidMount() {
    }
    getTicket = async (id) => {
        try {
            let data = await getTicket(id);
            if (data && data.data && data.data.success == 1) {
                return data.data.data
            } else {
                return null
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    openForm = (name, value) => {
        if (name == 'check') { this.setState({ isOpenFormCheck: value }) }
    }
    handleQR = async (result, error) => {
        if (!!result) {
            this.setState({ resultQR: result.text })
            let dataTicket = await this.getTicket(result.text);
            if (dataTicket == null) {
                this.setState({ statusCheck: 1 })
            } else {
                this.setState({ statusCheck: 2, dataTicket: dataTicket })
            }
        }
        if (!!error) {
            this.setState({ resultQR: false })
        }
    }
    stopCamera = () => {
        this.setState({ isOpenFormCheck: false })
    }
    render() {
        let statusCheck = this.state.statusCheck;
        let resultQR = this.state.resultQR;
        let dataTicket = this.state.dataTicket;

        return (
            <div className='flex items-center justify-center'>
                <div className='border shadow-md p-[20px] bg-white rounded-[5px] space-y-[5px]'>
                    <div className='text-center text-[18px]'><label>Kiểm tra vé</label></div>
                    <div className='flex space-x-[5px]'>
                        <Button size='large'
                            onClick={() => this.openForm('check', true)}
                            className='bg-black flex items-center justify-center space-x-[5px] text-white w-[150px]'>
                            <span className=''>Quét mã QR</span>
                            <AiOutlineScan />
                        </Button>
                    </div>
                </div>
                <Modal title="Kiểm tra vé" open={this.state.isOpenFormCheck}
                    okText={'Dừng quét mã'} okType={'default'} cancelText={'Thoát'}
                    onOk={() => this.stopCamera()}
                    onCancel={() => this.stopCamera()}
                    width={400}
                >
                    <div className='flex items-center justify-center'>
                        <div>
                            {this.state.isOpenFormCheck == true &&
                                <QrReader
                                    onResult={(result, error) => this.handleQR(result, error)}
                                    className='w-[250px] h-[300px]' />
                            }
                            <div>
                                <div className='space-y-[5px] w-full'>
                                    <div className='text-center border p-[5px] rounded-[5px]'>
                                        <label>Kết quả: {resultQR == false ? 'None' : resultQR}</label>
                                    </div>
                                    {statusCheck == 2 &&
                                        <Alert message="Xác minh thành công" type="success" showIcon />
                                    }
                                    {(statusCheck == 1) &&
                                        <Alert message="Xác minh thất bại" type="error" showIcon />
                                    }
                                    {statusCheck == 2 &&
                                        <div className='text-center border shadow-sm rounded-[5px] py-[5px] px-[10px]'>
                                            <div className=' text-[16px]'>
                                                <label>Mã code : {dataTicket.ticket_code}</label><br />
                                                <label>Họ tên : {dataTicket.student == null ? 'None' : dataTicket.student}</label><br />
                                                <label>Ngày tạo : {dataTicket.created_at}</label><br />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>

            </div>
        );
    }

}
export default withRouter(check);
