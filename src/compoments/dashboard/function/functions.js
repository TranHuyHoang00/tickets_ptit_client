import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import { ScanOutlined, UserOutlined, CaretDownOutlined, SmileOutlined } from '@ant-design/icons';
import { Space, Button, Modal, Alert, Divider } from 'antd';
import { withRouter } from 'react-router-dom';
import { AiOutlineScan } from "react-icons/ai";
import { QrReader } from 'react-qr-reader';
class functions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenFormCheck: false,
            delay: 500,
            resultQR: '',
        }
    }
    async componentDidMount() {
    }
    openForm = (name, value) => {
        if (name == 'check') { this.setState({ isOpenFormCheck: value }) }
    }
    handleQR = (result, error) => {
        if (!!result) {
            this.setState({ resultQR: result });
        }
        if (!!error) {
            this.setState({ resultQR: null })
        }
    }
    stopCamera = () => {
        this.setState({ isOpenFormCheck: false })
        window.location.reload()
    }
    render() {
        let resultQR = this.state.resultQR;
        return (
            <div className='flex items-center justify-center'>
                <div className='border shadow-md p-[20px] bg-white rounded-[5px] space-y-[5px]'>
                    <div className='text-center text-[18px]'><label>Kiểm tra vé</label></div>
                    <div className='flex space-x-[5px]'>
                        <Button size='large' onClick={() => this.openForm('check', true)}
                            className='bg-black flex items-center justify-center space-x-[5px] text-white w-[150px]'>
                            <span className=''>Quét mã QR</span>
                            <AiOutlineScan />
                        </Button>
                        <Button size='large'
                            className='bg-black flex items-center justify-center space-x-[5px] text-white w-[150px]'>
                            <span className=''>Chọn ảnh QR</span>
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
                            <QrReader
                                onResult={(result, error) => this.handleQR(result, error)}
                                style={{ width: '100%' }}
                            />
                            <div>
                                <div className='space-y-[10px]'>
                                    {resultQR == null ?
                                        <Alert message="Xác thực thất bại" type="error" showIcon closable />
                                        :
                                        <Alert message={`${resultQR}`} type="success" showIcon closable />
                                    }
                                    <div className='text-center border shadow-sm rounded-[5px] sm:p-[10px] p-[5px]
                                    border-green-500'>
                                        <label className='font-[600] text-[18px] sm:text-[22px]'>Thông tin vé</label>
                                        <div className=' text-[16px]'>
                                            <label>Người mua : Trần Huy Hoàng</label><br />
                                            <label>SĐT : 0886825357</label><br />
                                            <label>MSSV : N19DCCN065</label><br />
                                            <label>Ngày mua : 23/02/2001</label><br />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>

            </div>
        );
    }

}
export default withRouter(functions);
