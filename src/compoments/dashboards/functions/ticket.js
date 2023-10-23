import React from 'react';
import { withRouter } from 'react-router-dom';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { BsFillTicketFill, BsTicketPerforated, BsTicketPerforatedFill } from "react-icons/bs";
import { toast } from 'react-toastify';
import ReCAPTCHA from "react-google-recaptcha";
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import { getEvent, createBuyer, createOrderStaff, createTicket } from '../../../services/eventService';

const recaptchaRef = React.createRef();
const ButtonGroup = Button.Group;
class ticket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infor: {},
            ticket: 1,
            ReCAPTCHA: null,
            dataEvent: {},
        }
    }
    async componentDidMount() {
        await this.getEvent();
    }
    getEvent = async () => {
        try {
            let data = await getEvent();
            if (data && data.data && data.data.success == 1) {
                this.setState({ dataEvent: data.data.data })
            } else {
                this.setState({ dataEvent: {} })
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    onClickDecline = () => {
        let ticket = this.state.ticket;
        if (ticket <= 1) {
            return;
        } else {
            this.setState({
                ...this.state,
                ticket: ticket - 1,
            })
        }
    }
    onClickIncrease = () => {
        let ticket = this.state.ticket;
        if (ticket >= 5) {
            return;
        } else {
            this.setState({
                ...this.state,
                ticket: ticket + 1,
            })
        }
    }
    handleOnchangeInput = (event, id) => {
        let copyState = { ...this.state.infor };
        copyState[id] = event.target.value;
        this.setState({
            infor: {
                ...copyState
            }
        });
    }
    handleOnchangRC = (values) => {
        this.setState({
            ReCAPTCHA: values,
        })
    }
    onExpired = () => {
        this.setState({ ReCAPTCHA: null })
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
        let infor = this.state.infor;
        if (!infor.student_id) {
            return { mess: "Thiếu mã sinh viên", code: 1 };
        }
        if (this.isCheckEmpty(infor.student_id) !== 10) {
            return { mess: "Mã sinh viên là 10 kí tự", code: 1 };
        }
        if (this.isCheckSpace(infor.student_id) == true) {
            return { mess: "Mã sinh viên chứa khoảng trắng", code: 1 };
        }
        if (!infor.full_name) {
            return { mess: "Thiếu tên", code: 1 };
        }
        if (this.isCheckEmpty(infor.full_name) <= 3) {
            return { mess: "Tên phải lớn hơn 3 kí tự", code: 1 };
        }
        if (!infor.phone_number) {
            return { mess: "Thiếu số điện thoại", code: 1 };
        }
        if (this.isCheckEmpty(infor.phone_number) !== 10) {
            return { mess: "Số điện thoại là 10 số", code: 1 };
        }
        if (this.isCheckSpace(infor.phone_number) == true) {
            return { mess: "Số điện thoại có khoảng trắng", code: 1 };
        }
        if (!this.validatephone_numberNumber(infor.phone_number)) {
            return { mess: "Số điện thoại sai định dạng", code: 1 };
        }
        if (infor.ticket > this.state.dataEvent.avaliable_ticket) {
            return { mess: "Số lượng vé không đủ", code: 1 };
        }
        if (this.state.ReCAPTCHA == null) {
            return { mess: "Vui lòng xác minh ReCAPTCHA", code: 1 };
        }
        return { code: 0 };
    }
    createBuyer = async (input) => {
        try {
            let data = await createBuyer(input);
            if (data && data.data && data.data.success == 1) {
                return data.data.data
            } else {
                return null
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    createOrderStaff = async (input) => {
        try {
            let data = await createOrderStaff(input);
            if (data && data.data && data.data.success == 1) {
                return data.data.data
            } else {
                return null
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    createTicket = async (input) => {
        try {
            let data = await createTicket(input);
            if (data && data.data && data.data.success == 1) {
                return data.data.data
            } else {
                return null
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    handleSubmit = async () => {
        let result = this.Validation();
        if (result.code == 0) {
            let dataBuyer = await this.createBuyer(this.state.infor);
            if (dataBuyer == null) {
                toast.error("Tạo thông tin thất bại");
            } else {
                let order = {};
                order.buyer = dataBuyer.id;
                order.ticket_quantity = this.state.ticket;
                order.event = this.state.dataEvent.id;
                order.payment_status = "success";
                let dataOrder = await this.createOrderStaff(order);
                if (dataOrder == null) {
                    toast.error("Số vé bạn mua đã lớn hơn 5");
                } else {
                    let dataTicket = await this.createTicket({ order: dataOrder.id });
                    if (dataTicket == null) {
                        toast.error("Tạo vé thất bại");
                    } else {
                        toast.success("Đăng ký vé thành công");
                        this.setState({ infor: {} })
                    }
                }
            }
        } else {
            toast.error(result.mess);
        }
    }
    render() {
        let infor = this.state.infor;
        return (
            <div className=' h-auto w-auto flex items-center justify-center font-semibold'>
                <div className='p-[10px]'>
                    <div className='bg-gradient-to-r from-[#1e9dee] to-[#a951e9]
                    text-center p-[10px] rounded-t-[10px]'>
                        <label className='text-white font-[500] text-[20px]'>BÁN VÉ OFFLINE</label>
                    </div>
                    <div className='border shadow-md rounded-b-[10px]'>
                        <div className=' border-t md:border-none px-[20px] py-[10px] text-[16px] space-y-[16px] bg-white'>
                            <div className='space-y-[3px]'>
                                <div><label className=''>Mã sinh viên<span className='text-red-600 text-[12px]'> * Bắt buộc</span> </label></div>
                                <div className='border-b shadow-sm'>
                                    <Input placeholder='N23DCCN000'
                                        value={infor.student_id}
                                        onChange={(event) => this.handleOnchangeInput(event, 'student_id')}
                                        className='uppercase' bordered={false} />
                                </div>
                            </div>
                            <div className='space-y-[3px]'>
                                <div><label className=''>Họ và tên <span className='text-red-600 text-[12px]'> * Bắt buộc</span> </label></div>
                                <div className='border-b shadow-sm'>
                                    <Input placeholder='Nguyễn Văn A'
                                        value={infor.full_name}
                                        onChange={(event) => this.handleOnchangeInput(event, 'full_name')}
                                        className='' bordered={false} />
                                </div>
                            </div>
                            <div className='space-y-[3px]'>
                                <div><label className=''>Số điện thoại <span className='text-red-600 text-[12px]'> * Bắt buộc</span> </label></div>
                                <div className='border-b shadow-sm'>
                                    <Input placeholder='0885898652'
                                        value={infor.phone_number}
                                        onChange={(event) => this.handleOnchangeInput(event, 'phone_number')}
                                        className='' bordered={false} />
                                </div>
                            </div>
                            <div className='space-y-[3px]'>
                                <div>
                                    <label className='font-[500]'>Số lượng vé <span className='text-red-600 text-[12px]'> * Tối đa 5 vé</span> </label>
                                </div>
                                <ButtonGroup>
                                    <Button onClick={() => this.onClickDecline()} icon={<MinusOutlined />} />
                                    <Button disabled>{this.state.ticket}</Button>
                                    <Button onClick={() => this.onClickIncrease()} icon={<PlusOutlined />} />
                                </ButtonGroup>
                            </div>
                            <div className='space-y-[10px]'>
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={process.env.REACT_APP_STIE_KEY_RECAPCHA}
                                    onChange={(value) => this.handleOnchangRC(value)}
                                    onExpired={() => this.onExpired()}
                                />,
                                <Button type="primary" danger onClick={() => this.handleSubmit()}>ĐĂNG KÝ</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
    };
};
const mapDispatchToProps = dispatch => {
    return {
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ticket));