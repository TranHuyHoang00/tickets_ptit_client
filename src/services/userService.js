import api_admin from '../auths/api_admin';
import { Get_Local_Acount_DB } from '../auths/local_storage';

const getListUser = () => {
    return api_admin.get(`/auth/api/v1/list-user`,);
}
const createUser = (data) => {
    return api_admin.post(`/auth/api/v1/register`, data,);
}
const getUser = (id) => {
    return api_admin.get(`/auth/api/v1/get-user/${id}`,);
}
const deleteUser = (id) => {
    return api_admin.delete(`/auth/api/v1/get-user/${id}`,);
}
const editUser = (id, data) => {
    return api_admin.put(`/auth/api/v1/get-user/${id}`, data,);
}
const login = (data) => {
    return api_admin.post(`auth/api/v1/login`, data);
}
const refreshToken = () => {
    let data = Get_Local_Acount_DB();
    return api_admin.post(`auth/api/v1/token/refresh`, { refresh: data.data.refresh });
}
export {
    login, getListUser, createUser, getUser, deleteUser, editUser, refreshToken
}