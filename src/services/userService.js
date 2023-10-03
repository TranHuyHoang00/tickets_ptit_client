import axios from "axios";
import { GetLocal_Token } from '../auth/localStorage';
const login = (data) => {
    return axios.post(`${process.env.REACT_APP_HOST}auth/api/v1/login`, data);
}
const getListUser = () => {
    let token = GetLocal_Token()
    return axios.get(`${process.env.REACT_APP_HOST}/auth/api/v1/list-user`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
const createUser = (data) => {
    let token = GetLocal_Token()
    return axios.post(`${process.env.REACT_APP_HOST}/auth/api/v1/register`, data,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
const getUser = (id) => {
    let token = GetLocal_Token()
    return axios.get(`${process.env.REACT_APP_HOST}/auth/api/v1/get-user/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
const deleteUser = (id) => {
    let token = GetLocal_Token()
    return axios.delete(`${process.env.REACT_APP_HOST}/auth/api/v1/get-user/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
const editUser = (id, data) => {
    let token = GetLocal_Token()
    return axios.put(`${process.env.REACT_APP_HOST}/auth/api/v1/get-user/${id}`, data,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
export {
    login, getListUser, createUser, getUser, deleteUser, editUser
}