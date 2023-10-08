import axios from 'axios';
import { GetLocal_Token, GetLocal_AcountDB, SetLocal_AcountDB } from './localStorage';
import { refreshToken } from '../services/userService';
const api = axios.create({
    baseURL: `${process.env.REACT_APP_HOST}`,
});
api.interceptors.request.use(
    (config) => {
        // Kiểm tra xem token có hợp lệ hay không
        let token = GetLocal_Token()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
api.interceptors.response.use(

    (response) => {
        return response;
    },
    async (error) => {
        if (error.response.status === 401) {
            let data = await refreshToken();
            if (data && data.data && data.data.success == 1) {
                let dataAcount = GetLocal_AcountDB();
                dataAcount.data.access = data.data.data.access;
                SetLocal_AcountDB(dataAcount.data);
                window.location.reload();
            }
            // Token hết hạn, thực hiện xử lý tại đây
            // Ví dụ: Đăng nhập lại hoặc yêu cầu token mới
        }
        return Promise.reject(error);
    }
);

export default api;
