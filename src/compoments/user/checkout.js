import React from 'react';
import { withRouter } from 'react-router-dom';
import { QRCode, Space, Image, Alert } from 'antd';
import { BsFillTicketFill, BsCurrencyExchange, BsTicketPerforatedFill } from "react-icons/bs";
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
import { getOrder_Id, create_transaction } from '../../services/eventService';
class checkout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataOrder: {},
            dataTransaction: {},
            setMinutes: '',
            setSeconds: '',
            duration: ''
        }
    }
    async componentDidMount() {
        let TSV_Order = JSON.parse(window.localStorage.getItem('TSV_Order'));
        if (TSV_Order && TSV_Order.data) {
            this.LoadStatusCheckout(TSV_Order.data.id)
            await this.create_transaction({ order: TSV_Order.data.id });
        }
        let deadline = 10000;
        let dateNow = Date.now()
        this.setState({
            duration: deadline + dateNow,
        })
        //this.useEffect()
    }

    LoadStatusCheckout = async (id) => {
        const intervalId = setInterval(() => {
            this.HandleGetOrder_Id(id);
        }, 1000);
        this.setState({ intervalId });
        return () => clearInterval(intervalId);
    }
    HandleGetOrder_Id = async (id) => {
        try {
            let data = await getOrder_Id(id);
            if (data && data.data && data.data.success == 1) {
                this.setState({ dataOrder: data.data.data });
                if (data.data.data.payment_status == 'success') {
                    localStorage.removeItem('TSV_Order');
                    this.stopInterval()
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
    getTime = () => {
        let duration = (this.state.dataTransaction.expiry_date) - Date.now();
        this.setState({
            setMinutes: (Math.floor((duration / 1000 / 60) % 60)),
            setSeconds: (Math.floor((duration / 1000) % 60)),
        })
    }
    stopInterval = () => {
        clearInterval(this.state.intervalId);
    };
    useEffect = () => {
        const interval = setInterval(() => this.getTime(), 1000);
        return () => clearInterval(interval);
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
                            <Image src={dataTransaction.qrcode} width={200} />
                            {/* <QRCode value="https://ant.design/" status="loading" /> */}
                        </div>
                        <div>
                            {dataOrder.payment_status == 'pending' &&
                                <Alert message="Chờ thanh toán" type="warning" showIcon closable />
                            }
                            {dataOrder.payment_status == 'success' &&
                                <Alert message="Thanh toán thành công" type="success" showIcon closable />
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