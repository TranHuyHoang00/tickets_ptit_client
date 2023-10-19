import api_admin from '../auths/api_admin';
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
const refreshToken = (refresh) => {
    return api_admin.post(`auth/api/v1/token/refresh`, { refresh: refresh });
}
export {
    login, getListUser, createUser, getUser, deleteUser, editUser, refreshToken
}