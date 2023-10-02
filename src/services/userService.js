import axios from "axios";
import { GetLocalStorage } from '../auth/localStorage';
const getToken = () => {
    let data = GetLocalStorage('TSV_AcountDB');
    if (data && data.data) {
        return data.data.access
    } else { return null }
}
let token = getToken();

const login = (data) => {
    return axios.post(`${process.env.REACT_APP_HOST}auth/api/v1/login`, data);
}
const getListUser = () => {
    return axios.get(`${process.env.REACT_APP_HOST}/auth/api/v1/list-user`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
const createUser = (data) => {
    return axios.post(`${process.env.REACT_APP_HOST}/auth/api/v1/register`, data,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
const getUser = (id) => {
    return axios.get(`${process.env.REACT_APP_HOST}/auth/api/v1/get-user/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
const deleteUser = (id) => {
    return axios.delete(`${process.env.REACT_APP_HOST}/auth/api/v1/get-user/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
const editUser = (id, data) => {
    return axios.put(`${process.env.REACT_APP_HOST}/auth/api/v1/get-user/${id}`, data,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
export {
    login, getListUser, createUser, getUser, deleteUser, editUser
}