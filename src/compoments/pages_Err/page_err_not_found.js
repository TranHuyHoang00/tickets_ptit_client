import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Empty, Button, Result } from 'antd';
class page_err_not_found extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
    }
    onClickPage = () => {
        this.props.history.push(`/home`);

    }
    render() {
        return (
            <div>
                <Result
                    status="404" title="404"
                    subTitle="Xin lỗi, trang này hiện không tồn tại."
                    extra={
                        <Button onClick={() => this.onClickPage()}
                            type="default" className='bg-blue-500 text-white'>Trang chủ</Button>
                    }
                />
            </div>
        );
    }

}
export default withRouter(page_err_not_found);
