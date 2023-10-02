import React from 'react';
import { withRouter } from 'react-router-dom';
import { QRCode, Space, Image, Alert } from 'antd';
import { BsFillTicketFill, BsCurrencyExchange, BsTicketPerforatedFill } from "react-icons/bs";
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { getOrder, create_transaction } from '../../services/eventService';
class checkout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataOrder: {},
            dataTransaction: {},
            setMinutes: '',
            setSeconds: '',
            countDowm: true,
        }
    }
    async componentDidMount() {
        let TSV_Order = JSON.parse(window.localStorage.getItem('TSV_Order'));
        if (TSV_Order && TSV_Order.data) {
            this.checkStatusOrder(TSV_Order.data.id)
            await this.create_transaction({ order: TSV_Order.data.id });
            this.TimeCountDown()
        }
    }
    checkStatusOrder = async (id) => {
        const intervalStatusOrder = setInterval(() => { this.handleGetOrder_Id(id) }, 1000);
        this.setState({ intervalStatusOrder });
        return () => clearInterval(intervalStatusOrder);
    }
    handleGetOrder_Id = async (id) => {
        try {
            let data = await getOrder(id);
            if (data && data.data && data.data.success == 1) {
                this.setState({ dataOrder: data.data.data });
                if (data.data.data.payment_status == 'success') {
                    localStorage.removeItem('TSV_Order');
                    clearInterval(this.state.intervalStatusOrder);
                    setTimeout(() => { this.props.history.push(`/`) }, 5000);
                }
            } else {
                this.setState({ dataOrder: {} });
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    create_transaction = async (input) => {
        try {
            let data = await create_transaction(input);
            if (data && data.data && data.data.success == 1) {
                this.setState({ dataTransaction: data.data.data });
            } else {
                this.setState({ dataTransaction: {} });
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    TimeCountDown = () => {
        const intervalCountDownt = setInterval(() => { this.getTime() }, 1000);
        this.setState({ intervalCountDownt });
        return () => clearInterval(intervalCountDownt);
    }
    getTime = () => {
        let time = Date.parse(this.state.dataTransaction.expiry_date) - Date.now();
        if (time <= 0) {
            clearInterval(this.state.intervalCountDownt);
            clearInterval(this.state.intervalStatusOrder);
            this.setState({ countDowm: false });
            localStorage.removeItem('TSV_Order');
        } else {
            this.setState({
                setMinutes: (Math.floor((time / 1000 / 60) % 60)),
                setSeconds: (Math.floor((time / 1000) % 60)),
            })
        }
    }
    render() {
        let minutes = this.state.setMinutes;
        let seconds = this.state.setSeconds;
        let dataOrder = this.state.dataOrder;
        let dataTransaction = this.state.dataTransaction;
        return (
            <div className='h-screen
            p-[20px]  flex items-center justify-center font-semibold'>
                <div className=' bg-white rounded-[8px] border shadow-md'>
                    <div className='text-center bg-[#1a1a1a] bg-gradient-to-r from-[#1e9dee] to-[#a951e9]
                    text-white font-[500] text-[18px] p-[10px] rounded-t-[8px]'>
                        <h1>THANH TOÁN ONLINE QUA MOMO</h1>
                    </div>
                    <div className='p-[10px] space-y-[10px]'>
                        <div className='flex items-center justify-center '>
                            {this.state.countDowm == true &&
                                <Image src={dataTransaction.qrcode} width={200} />
                            }
                        </div>
                        <div>
                            {this.state.countDowm == false &&
                                <Alert message="Hết hạn thanh toán" type="warning" showIcon />
                            }
                            {dataOrder.payment_status == 'pending' && this.state.countDowm == true &&
                                <Alert message="Chờ thanh toán" type="warning" showIcon />
                            }
                            {dataOrder.payment_status == 'success' && this.state.countDowm == true &&
                                <Alert message="Thanh toán thành công" type="success" showIcon />
                            }
                        </div>
                        <div className='text-center text-red-600 border p-[4px] shadow-sm rounded-[3px]'>
                            <span className='bg-white px-[2px] py-[2px] rounded-[2px]'>{minutes < 10 ? "0" + minutes : minutes}</span>
                            <span className=''>:</span>
                            <span className='bg-white px-[2px] py-[2px] rounded-[2px]'>{seconds < 10 ? "0" + seconds : seconds}</span>
                        </div>
                        <div className='space-y-[10px]'>
                            <div className='flex items-center justify-center  bg-gradient-to-r from-[#17f0a1] to-[#04ce89]
                                    border shadow-md rounded-[5px] space-x-[20px] text-white p-[5px]'>
                                <div className='text-[50px]'><BsTicketPerforatedFill /></div>
                                <div className='text-[16px] text-center'>
                                    <div className='text-[14px]'><label>Tổng vé</label></div>

                                    <div><label className=''>{dataOrder.ticket_quantity} cái</label></div>
                                </div>
                            </div>
                            <div className='flex items-center justify-center bg-gradient-to-r from-[#fda682] to-[#f7789d]
                                    border shadow-md rounded-[5px] space-x-[20px] text-white p-[5px]'>
                                <div className='text-[50px]'><BsCurrencyExchange /></div>
                                <div className='text-[16px] text-center'>
                                    <div className='text-[14px]'><label>Tổng tiền</label></div>
                                    <div><label className=''>{`${dataOrder.total_amount}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} vnđ</label></div>
                                </div>
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
        data_form_infor: state.data.data_form_infor,
    };
};
const mapDispatchToProps = dispatch => {
    return {
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(checkout));