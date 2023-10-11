import axios from 'axios';
import { Get_Local_Token_Acount_User } from './local_storage';
const api_user = axios.create({
    baseURL: `${process.env.REACT_APP_API}`,
});
api_user.interceptors.request.use(
    (config) => {
        let token = Get_Local_Token_Acount_User();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
api_user.interceptors.response.use(

    (response) => {
        return response;
    },
    async (error) => {
        if (error.response.status === 401) {
        }
        return Promise.reject(error);
    }
);

export default api_user;
