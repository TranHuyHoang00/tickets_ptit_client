import React from 'react';
import { withRouter } from 'react-router-dom';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { BsFillTicketFill, BsTicketPerforated, BsTicketPerforatedFill } from "react-icons/bs";
import { toast } from 'react-toastify';
import ReCAPTCHA from "react-google-recaptcha";
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import { getEvent, createBuyer, createOrder } from '../../../services/eventService';
import bg from '../../../assets/images/bg.png';
const recaptchaRef = React.createRef();
const ButtonGroup = Button.Group;
class form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infor: {},
            ticket: 1,
            ReCAPTCHA: null,
            setDays: '',
            setHours: '',
            setMinutes: '',
            setSeconds: '',
            dataEvent: {},
            isOpenDialog: false,
        }
    }
    async componentDidMount() {
        this.timeCountDown()
        await this.getEvent();
        let TSV_Order = JSON.parse(window.localStorage.getItem(`${process.env.REACT_APP_LOCALHOST_DATA_ORDER_USER}`));
        if (TSV_Order && TSV_Order.data) {
            let dataBuyer = TSV_Order.data.buyer;
            let infor = this.state.infor;
            infor.full_name = dataBuyer.full_name;
            infor.phone_number = dataBuyer.phone_number;
            infor.student_id = dataBuyer.student_id;
            this.setState({
                ...this.state.infor,
                infor: infor,
                ticket: TSV_Order.data.ticket_quantity
            })
        }

    }
    getEvent = async () => {
        try {
            let data = await getEvent();
            if (data && data.data && data.data.success == 1) {
                this.setState({ dataEvent: data.data.data })
            } else {
                return this.setState({ dataEvent: {} })
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    getTime = () => {
        let deadline = this.state.dataEvent.expiry_date;
        let time = Date.parse(deadline) - Date.now();
        this.setState({
            setDays: (Math.floor(time / (1000 * 60 * 60 * 24))),
            setHours: (Math.floor((time / (1000 * 60 * 60)) % 24)),
            setMinutes: (Math.floor((time / 1000 / 60) % 60)),
            setSeconds: (Math.floor((time / 1000) % 60)),
        })
    }
    timeCountDown = () => {
        const interval = setInterval(() => this.getTime(), 1000);
        return () => clearInterval(interval);
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
    createOrder = async (input) => {
        try {
            let data = await createOrder(input);
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
                let dataOrder = await this.createOrder(order);
                if (dataOrder == null) {
                    toast.error("Tạo order thất bại");
                } else {
                    localStorage.setItem(`${process.env.REACT_APP_LOCALHOST_DATA_ORDER_USER}`, JSON.stringify(
                        { data: dataOrder }
                    ))
                    this.props.history.push(`/home/checkout`);
                }
            }
        } else {
            toast.error(result.mess);
        }
    }
    render() {
        let days = this.state.setDays;
        let hours = this.state.setHours;
        let minutes = this.state.setMinutes;
        let seconds = this.state.setSeconds;
        let dataEvent = this.state.dataEvent;
        let infor = this.state.infor;
        return (
            <div className=' md:w-screen md:h-screen h-auto w-auto p-[10px]  bg-center sm:bg-cover bg-no-repeat 
            flex items-center justify-center font-semibold' style={{ backgroundImage: `url(${bg})` }}>
                <div className=' bg-white rounded-[5px]'>
                    <div className='bg-gradient-to-r from-[#1e9dee] to-[#a951e9]
                    text-center p-[10px] rounded-t-[5px]'>
                        <label className='text-white font-[500] text-[20px]'>ĐĂNG KÝ MUA VÉ</label>
                    </div>
                    <div className='md:grid grid-cols-2 
                    border shadow-md rounded-b-[10px]'>
                        <div className=' flex justify-center p-[14px] border-r'>
                            <div className='text-center font-[700] space-y-[10px]'>
                                <label className='text-[24px] font-serif:'>{dataEvent.event_name}</label> <br />
                                <div className='text-[16px] p-[6px] space-x-[6px]
                                flex items-center justify-center  text-white border rounded-[10px] shadow-md'>
                                    <div className='bg-[#00bf96] p-[10px] rounded-[8px] space-y-[2px]'>
                                        <div className=''>
                                            <span className='bg-[#00816a] p-[5px] rounded-[5px]'>{days < 10 ? "0" + days : days} </span>
                                        </div>
                                        <div><span>Ngày</span></div>
                                    </div>
                                    <div className='bg-[#00bf96] p-[10px] rounded-[8px] space-y-[2px]'>
                                        <div className=''>
                                            <span className='bg-[#00816a] p-[5px] rounded-[5px]'>{hours < 10 ? "0" + hours : hours} </span>
                                        </div>
                                        <div><span>Giờ</span></div>
                                    </div>
                                    <div className='bg-[#00bf96] p-[10px] rounded-[8px] space-y-[2px]'>
                                        <div className=''>
                                            <span className='bg-[#00816a] p-[5px] rounded-[5px]'>{minutes < 10 ? "0" + minutes : minutes} </span>
                                        </div>
                                        <div><span>Phút</span></div>
                                    </div>
                                    <div className='bg-[#00bf96] p-[10px] rounded-[8px] space-y-[2px]'>
                                        <div className=''>
                                            <span className='bg-[#00816a] p-[5px] rounded-[5px]'>{seconds < 10 ? "0" + seconds : seconds} </span>
                                        </div>
                                        <div><span>Giây</span></div>
                                    </div>
                                </div>
                                <div className='space-y-[10px]'>
                                    {/* <div className='flex items-center justify-center bg-gradient-to-r from-[#7ccdff] to-[#7196ff]
                                    border shadow-md rounded-[5px] space-x-[20px] text-white p-[5px]'>
                                        <div className='text-[50px]'><BsFillTicketFill /></div>
                                        <div className='text-[16px]'>
                                            <div className='text-[12px]'><label>Tổng vé</label></div>
                                            <div><label className=''>{dataEvent.total_ticket} vé</label></div>
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-center bg-gradient-to-r from-[#fda682] to-[#f7789d]
                                    border shadow-md rounded-[5px] space-x-[20px] text-white p-[5px]'>
                                        <div className='text-[50px]'><BsTicketPerforatedFill /></div>
                                        <div className='text-[16px]'>
                                            <div className='text-[12px]'><label>Đã bán</label></div>
                                            <div><label className=''>{dataEvent.total_ticket - dataEvent.avaliable_ticket} vé</label></div>
                                        </div>
                                    </div> */}
                                    <div className='flex items-center justify-center bg-gradient-to-r from-[#17f0a1] to-[#04ce89]
                                    border shadow-md rounded-[5px] space-x-[20px] text-white p-[5px]'>
                                        <div className='text-[50px]'><BsTicketPerforated /></div>
                                        <div className='text-[16px]'>
                                            <div className='text-[12px]'><label>Còn lại</label></div>
                                            <div><label className=''>{dataEvent.avaliable_ticket} vé</label></div>
                                        </div>
                                    </div>
                                </div>
                                <div className='text-[16px] text-[#414e66]'>
                                    <label>Ngày hết hạn : {dataEvent.expiry_date}</label>
                                </div>
                                <div className='text-[12px] 
                                text-red-500 border border-red-500 p-[10px] rounded-[10px] shadow-sm '>
                                    <span>Vui lòng điền đầy đủ </span><br />
                                    <span>và chính xác thông tin đăng ký</span>
                                </div>
                            </div>
                        </div>
                        <div className=' border-t md:border-none
                        px-[30px] py-[10px] text-[16px] space-y-[16px]'>
                            <div className='space-y-[3px]'>
                                <div><label className=''>Mã sinh viên<span className='text-red-600 text-[12px]'> * Bắt buộc</span> </label></div>
                                <div className='border-b shadow-sm'>
                                    <Input placeholder='N19DCCN065'
                                        value={infor.student_id}
                                        onChange={(event) => this.handleOnchangeInput(event, 'student_id')}
                                        className='uppercase' bordered={false} />
                                </div>
                            </div>
                            <div className='space-y-[3px]'>
                                <div><label className=''>Họ và tên <span className='text-red-600 text-[12px]'> * Bắt buộc</span> </label></div>
                                <div className='border-b shadow-sm'>
                                    <Input placeholder='Vũ Trung An'
                                        value={infor.full_name}
                                        onChange={(event) => this.handleOnchangeInput(event, 'full_name')}
                                        className='' bordered={false} />
                                </div>
                            </div>
                            <div className='space-y-[3px]'>
                                <div><label className=''>Số điện thoại <span className='text-red-600 text-[12px]'> * Bắt buộc</span> </label></div>
                                <div className='border-b shadow-sm'>
                                    <Input placeholder='0789822001 - (10 SỐ)'
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
                                />
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
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(form));