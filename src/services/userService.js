import api from '../auth/axiosInterceptor';
import { GetLocal_AcountDB } from '../auth/localStorage';
const login = (data) => {
    return api.post(`auth/api/v1/login`, data);
}
const getListUser = () => {
    return api.get(`/auth/api/v1/list-user`,);
}
const createUser = (data) => {
    return api.post(`/auth/api/v1/register`, data,);
}
const getUser = (id) => {
    return api.get(`/auth/api/v1/get-user/${id}`,);
}
const deleteUser = (id) => {
    return api.delete(`/auth/api/v1/get-user/${id}`,);
}
const editUser = (id, data) => {
    return api.put(`/auth/api/v1/get-user/${id}`, data,);
}
const refreshToken = () => {
    let data = GetLocal_AcountDB();
    return api.post(`auth/api/v1/token/refresh`, { refresh: data.data.refresh });
}
export {
    login, getListUser, createUser, getUser, deleteUser, editUser, refreshToken
}