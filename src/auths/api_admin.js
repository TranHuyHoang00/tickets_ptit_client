import axios from 'axios';
import { Get_Local_Acount_DB, Set_Local_Acount_DB, Get_Local_Token_Acount_DB } from './local_storage';
import { refreshToken } from '../services/userService';
const api = axios.create({
    baseURL: `${process.env.REACT_APP_API}`,
});
api.interceptors.request.use(
    (config) => {
        let token = Get_Local_Token_Acount_DB()
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
                let dataAcount = Get_Local_Acount_DB();
                dataAcount.data.access = data.data.data.access;
                Set_Local_Acount_DB(dataAcount.data);
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export default api;
