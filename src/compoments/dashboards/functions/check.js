import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";
import { Button, Modal, Alert, Input } from 'antd';
import { withRouter } from 'react-router-dom';
import { AiOutlineScan } from "react-icons/ai";
import { QrReader } from 'react-qr-reader';
import { getTicket, editTicket, createStudent } from '../../../services/eventService';
import { toast } from 'react-toastify';
import errSound from '../../../assets/sounds/err.mp3';
import sucSound from '../../../assets/sounds/suc.mp3';

class check extends Component {
    constructor(props) {
        super(props);
        this.QrReader_Ref = React.createRef();
        this.state = {
            isOpenFormCheck: false,
            isOpenCreateStudent: false,
            delay: 500,
            resultQR: false,
            statusCheck: 0,
            dataTicket: {},
            dataStudent: {},
            isOpenCamera: false,
        }
    }
    async componentDidMount() {
    }
    setupCamera = async () => {
        try {
            const constraints = { video: { facingMode: 'environment' } };
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            this.mediaStream = mediaStream;
            const videoTrack = this.mediaStream.getVideoTracks()[0];
            const capabilities = videoTrack.getCapabilities();
            console.log("media", mediaStream.getVideoTracks()[0]);
            if (this.QrReaderRef.current) {
                this.QrReaderRef.current.srcObject = mediaStream;
                this.QrReaderRef.current.play();
            }
            if ('zoom' in capabilities) {
                const currentZoom = videoTrack.getCapabilities().zoom ?? 1;
                console.log('currentZoom', currentZoom)
                videoTrack.applyConstraints({ advanced: [{ zoom: 2.5 }] })
            }

        } catch (err) {
            console.error(err);
        }
    };
    openForm = (name, value) => {
        if (name == 'check') {
            this.setupCamera();
            this.setState({ isOpenFormCheck: value })
        }
        if (name == 'edit') { this.setState({ isOpenCreateStudent: value }) }
    }
    getTicket = async (id) => {
        try {
            let data = await getTicket(id);
            if (data && data.data && data.data.success == 1) {
                let dataStudent = data.data.data.student;
                if (dataStudent !== null) {
                    let dataST = {};
                    dataST.full_name = dataStudent.full_name;
                    dataST.student_id = dataStudent.student_id;
                    dataST.cccd = dataStudent.cccd;
                    this.setState({ dataStudent: dataST })
                }
                return data.data.data
            } else {
                return null
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    handleQRcheck = async (result, error) => {
        if (!!result) {
            this.setState({ resultQR: result.text })
            let dataTicket = await this.getTicket(result.text);
            if (dataTicket == null) {
                let err = new Audio(errSound);
                err.play();
                this.setState({ statusCheck: 1 })
            } else {
                let suc = new Audio(sucSound);
                suc.play();
                this.setState({
                    statusCheck: 2,
                    dataTicket: dataTicket,
                    editTicket: { id: dataTicket.id }
                })
            }
        }
        if (!!error) {
            this.setState({ resultQR: false })
        }
    }
    stopCamera = (name, value) => {
        if (name == 'check') {
            this.setState({ isOpenFormCheck: value })
            window.location.reload();
        }
        if (name == 'edit') { this.setState({ isOpenCreateStudent: value }) }
    }
    handleOnchangeInput = (event, id) => {
        let copyState = { ...this.state.dataStudent };
        copyState[id] = event.target.value;
        this.setState({
            dataStudent: {
                ...copyState
            }
        });
    }
    isCheckEmpty = (value) => {
        return value.trim().length
    }
    isCheckSpace = (value) => {
        return (/\s/).test(value);
    }
    validatephone_numberNumber = (phone_number) => {
        const re = /^(?:\+84|0)(?:3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-46-9])(?:\d{7}|\d{7})$/;
        return re.test(phone_number);
    }
    Validation = () => {
        let dataStudent = this.state.dataStudent;
        if (!dataStudent.full_name) {
            return { mess: "Thiếu tên", code: 1 };
        }
        if (this.isCheckEmpty(dataStudent.full_name) <= 3) {
            return { mess: "Tên phải lớn hơn 3 kí tự", code: 1 };
        }
        return { code: 0 };
    }
    createStudent = async (input) => {
        let result = this.Validation();
        if (result.code == 0) {
            try {
                let data = await createStudent(input);
                if (data && data.data && data.data.success == 1) {
                    return data.data.data
                } else {
                    return { mess: "Tạo thất bại", code: 1 };
                }
            } catch (e) {
                console.log('Lỗi', e);
            }
        } else {
            return result
        }
    }
    editTicket = async () => {
        let dataStudent = await this.createStudent(this.state.dataStudent);
        if (dataStudent && dataStudent.code) {
            toast.error(dataStudent.mess)
        } else {
            try {
                let data = await editTicket({ student: dataStudent.id }, this.state.dataTicket.ticket_code);
                if (data && data.data && data.data.success == 1) {
                    this.setState({
                        dataTicket: data.data.data,
                        isOpenCreateStudent: false,
                    });
                } else {
                    toast.error("Cập nhập vé thất bại")
                }
            } catch (e) {
                console.log('Lỗi', e);
            }
        }
    }
    render() {
        let statusCheck = this.state.statusCheck;
        let resultQR = this.state.resultQR;
        let dataTicket = this.state.dataTicket;
        let dataStudent = this.state.dataStudent;
        return (
            <div className='flex items-center justify-center'>
                <div className='space-y-[10px]'>
                    <div className='border shadow-md p-[10px] bg-white rounded-[5px] space-y-[5px]'>
                        <div className='text-center text-[18px]'><label>Kiểm tra vé</label></div>
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
                    onOk={() => this.stopCamera('check', false)}
                    onCancel={() => this.stopCamera('check', false)}
                    width={400}
                >
                    <div className='flex items-center justify-center'>
                        <div>
                            <QrReader ref={this.QrReader_Ref}
                                constraints={{ facingMode: 'environment' }}
                                cameraOptions={{ zoom: 2.0 }}
                                onResult={(result, error) => this.handleQRcheck(result, error)}
                                className='w-[250px] h-[300px]'
                            />
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
                                        <div className='space-y-[5px]'>
                                            <div className='text-center border shadow-sm rounded-[5px] py-[5px] px-[10px]'>
                                                <div className=' text-[16px]'>
                                                    <label>Mã code : {dataTicket.ticket_code}</label><br />
                                                    {dataTicket.student == null ?
                                                        <>
                                                            <label>Chủ sở hữu : None</label><br />
                                                        </>
                                                        :
                                                        <>
                                                            <label>Họ tên : {dataTicket.student && dataTicket.student.full_name == null ? 'None' : dataTicket.student.full_name}</label><br />
                                                            <label>Mã sinh viên : {dataTicket.student && dataTicket.student.student_id == null ? 'None' : dataTicket.student.student_id}</label><br />
                                                            <label>Căn cước : {dataTicket.student && dataTicket.student.cccd == null ? 'None' : dataTicket.student.cccd}</label><br />
                                                        </>
                                                    }
                                                    <label>Ngày tạo : {dataTicket.created_at}</label><br />
                                                </div>
                                            </div>
                                            <div className='text-center'>
                                                <Button onClick={() => this.openForm('edit', true)} type='default' className='bg-green-400 text-white'>Xác nhận danh tính</Button>
                                            </div>
                                        </div>

                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
                <Modal title="Xác nhận danh tính" open={this.state.isOpenCreateStudent}
                    okText={'Xác nhận'} okType={'default'} cancelText={'Thoát'}
                    onOk={() => this.editTicket()}
                    onCancel={() => this.openForm('edit', false)}
                    width={300}
                >
                    <div className='space-y-[5px]'>
                        <div>
                            <label>Họ và tên<span className='text-red-600 text-[12px]'> * Bắt buộc</span></label>
                            <Input value={dataStudent.full_name}
                                onChange={(event) => this.handleOnchangeInput(event, 'full_name')} />
                        </div>
                        <div>
                            <label>Mã sinh viên</label>
                            <Input value={dataStudent.student_id}
                                onChange={(event) => this.handleOnchangeInput(event, 'student_id')} />
                        </div>
                        <div>
                            <label>Căn cước</label>
                            <Input value={dataStudent.cccd}
                                onChange={(event) => this.handleOnchangeInput(event, 'cccd')} />
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }

}
export default withRouter(check);
