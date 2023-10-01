import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Empty, Button } from 'antd';
class errPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
    }
    goBack = () => {
        this.props.history.push(`/`);

    }
    render() {
        return (
            <div className='flex items-center justify-center h-screen w-screen'>
                <div className='text-center space-y-[10px]'>
                    <Empty
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        imageStyle={{
                            height: 60,
                        }}
                        description={
                            <span>
                                Không tìm thấy
                            </span>
                        }
                    />
                    <Button onClick={() => this.goBack()} type="default">Trang chủ</Button>
                </div>
            </div>
        );
    }

}
export default withRouter(errPage);
