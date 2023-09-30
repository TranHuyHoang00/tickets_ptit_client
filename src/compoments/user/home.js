import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Modal, Alert } from 'antd';
import { toast } from 'react-toastify';
import { getEvent } from '../../services/eventService';
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
        //window.location.reload()
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
        if (this.state.dataEvent.is_activate == true) {
            this.props.history.push(`/form`);
        }
    }
    render() {
        let statusEvent = this.state.statusEvent;
        return (
            //style={{ backgroundImage: `url(${bg})` }}
            <div className='h-screen w-screen bg-cover bg-no-repeat
            flex items-center justify-center' >
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
                    <Modal title="Lưu ý khi mua vé" open={this.state.isOpenDialog}
                        okText={'Tiếp tục'} okType={'default'} cancelText={'Hủy bỏ'}
                        onOk={() => this.goToForm()}
                        onCancel={() => this.openDialog(false)}
                    >
                        <h1>xxxx</h1>
                    </Modal>
                </div>

            </div>
        )
    }
}

export default withRouter(home);