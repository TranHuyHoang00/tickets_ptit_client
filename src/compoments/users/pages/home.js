import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Modal, Alert, Image } from 'antd';
import { getEvent } from '../../../services/eventService';
import anhminhhoa from '../../../assets/images/anhminhhoa.jpg';
import bg from '../../../assets/images/bg.png';
class home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: 'Lỗi Server 3',
            status_Event: 3,
            dataEvent: {},
            isOpenDialog: false,
        }
    }

    async componentDidMount() {
        await this.getEvent();
    }
    checkEvent = (dataEvent) => {
        if (dataEvent.is_activate == true) {
            let DateNow = new Date();
            let expiry_date = new Date(dataEvent.expiry_date);
            if (DateNow > expiry_date) {
                this.setState({
                    alert: 'Đã hết hạn đăng ký',
                    status_Event: 4,
                })
            }
            if (DateNow < expiry_date) {
                this.setState({
                    alert: 'Sự kiện đang mở',
                    status_Event: 0,
                })
            }
        } else {
            this.setState({
                alert: 'Sự kiện đang đóng',
                status_Event: 4,
            })
        }
    }
    getEvent = async () => {
        try {
            let data = await getEvent();
            if (data && data.data && data.data.success == 1) {
                this.checkEvent(data.data.data);
            } else {
                this.setState({ status_Event: 2, alert: 'Lỗi Server 2' })
            }
        } catch (e) {
            this.setState({ status_Event: 1, alert: 'Lỗi Server 1' })
            console.log('Lỗi Server 1', e);
        }
    }
    openDialog = (input) => {
        this.setState({ isOpenDialog: input })
    }
    onclickPage = () => {
        if (this.state.status_Event == 0) {
            this.props.history.push(`/home/form`);
        }
    }
    render() {
        let status_Event = this.state.status_Event;
        return (

            <div className='h-screen w-screen bg-center sm:bg-cover bg-no-repeat 
            flex items-center justify-center' style={{ backgroundImage: `url(${bg})` }}>
                <div className='space-y-[5px]'>
                    <div>
                        <img src={require(`../../../assets/images/LOGO_CSV23.png`).default} className='h-[100px] sm:h-[200px] md:h-[250px] w-auto' />
                    </div>
                    <div className='flex items-center justify-center'>
                        <div className='space-y-[5px] border p-[10px] shadow-md rounded-[5px]'>
                            {status_Event == 0 ?
                                <Button onClick={() => this.openDialog(true)}
                                    className='shadow-md bg-blue-400'
                                    size="large" type="primary" >
                                    ĐĂNG KÝ MUA VÉ
                                </Button>
                                :
                                <Button
                                    className='shadow-md bg-blue-400'
                                    size="large" type="primary" disabled >
                                    ĐĂNG KÝ MUA VÉ
                                </Button>
                            }
                            {status_Event == 0 ?
                                <Alert message={this.state.alert} type="success" showIcon />
                                :
                                <Alert message={this.state.alert} type="error" showIcon />
                            }
                        </div>
                    </div>
                </div>
                <Modal title="Quy định trước khi mua vé" open={this.state.isOpenDialog}
                    okText={'Tiếp tục'} okType={'default'} cancelText={'Hủy bỏ'}
                    onOk={() => this.onclickPage()}
                    onCancel={() => this.openDialog(false)}
                >
                    <div className=' p-[10px] border shadow-md rounded-[5px] space-y-[5px] italic text-red-700'>
                        <div className='space-y-[5px]'>
                            <div>
                                <label>1. Không thay đổi thông tin ghi chú tự động và số tiền chuyển khoản sau khi quét mã QR.</label>
                            </div>
                            <div className='flex items-center justify-center'> <Image src={anhminhhoa} width={200} /></div>
                        </div>
                        <div>
                            <label>2. Không thoát chương trình trong quá trình đợi xác thực thanh toán.</label>
                        </div>
                        <div>
                            <label>3. Điền thông tin MSSV chính xác vì vé sẽ được gửi qua email sinh viên. Kiểm tra mục spam sau khi thanh toán thành công nếu không thấy mail trong hộp thư.</label><br />
                        </div>
                        <div>
                            <label>4. Bấm vào "Tiếp tục", tức là bạn "Đồng ý" với những quy định trên.</label>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRouter(home);