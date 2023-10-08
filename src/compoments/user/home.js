import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Modal, Alert, Image } from 'antd';
import { getEvent } from '../../services/eventService';
import anhminhhoa from '../../assets/images/anhminhhoa.jpg';
class home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenDialog: false,
            alert: 'Lỗi',
            statusEvent: 1,
            dataEvent: {},
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
                    statusEvent: 2,
                })
            }
            if (DateNow < expiry_date) {
                this.setState({
                    alert: 'Sự kiện đang mở',
                    statusEvent: 0,
                })
            }
        } else {
            this.setState({
                alert: 'Sự kiện đang đóng',
                statusEvent: 1,
            })
        }
    }
    getEvent = async () => {
        try {
            let data = await getEvent();
            if (data && data.data && data.data.success == 1) {
                this.checkEvent(data.data.data);
                this.setState({ dataEvent: data.data.data })
            } else {
                return this.setState({ dataEvent: {} })
            }
        } catch (e) {
            console.log('Lỗi', e);
        }
    }
    openDialog = (input) => {
        this.setState({ isOpenDialog: input })
    }
    goToForm = () => {
        if (this.state.statusEvent == 0) {
            this.props.history.push(`/form`);
        }
    }
    render() {
        let statusEvent = this.state.statusEvent;
        return (
            //style={{ backgroundImage: `url(${bg})` }}
            <div className='h-screen w-screen bg-cover bg-no-repeat
            flex items-center justify-center' >
                <div className='space-y-[5px]'>
                    <div>
                        <img src={require(`../../assets/images/LOGO_CSV23.png`).default} className='h-[100px] sm:h-[200px] md:h-[250px] w-auto' />
                    </div>
                    <div className='flex items-center justify-center'>
                        <div className='space-y-[5px] border p-[10px] shadow-md rounded-[5px]'>
                            {statusEvent == 0 ?
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
                            {statusEvent == 0 ?
                                <Alert message={this.state.alert} type="success" showIcon />
                                :
                                <Alert message={this.state.alert} type="warning" showIcon />
                            }
                        </div>
                    </div>
                </div>
                <Modal title="Quy định trước khi mua vé" open={this.state.isOpenDialog}
                    okText={'Tiếp tục'} okType={'default'} cancelText={'Hủy bỏ'}
                    onOk={() => this.goToForm()}
                    onCancel={() => this.openDialog(false)}
                >
                    <div className=' p-[10px] border shadow-md rounded-[5px] space-y-[5px] italic '>
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