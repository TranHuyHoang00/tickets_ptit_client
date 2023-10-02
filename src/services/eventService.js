import axios from "axios";
import { GetLocalStorage } from '../auth/localStorage';
const getToken = () => {
    let data = GetLocalStorage('TSV_AcountDB');
    if (data && data.data) {
        return data.data.access
    } else { return null }
}
let token = getToken();
// Event
const getEvent = () => {
    return axios.get(`${process.env.REACT_APP_HOST}ticketify/api/v1/get-event/${process.env.REACT_APP_EVENT_CODE}`);
}
const getListEvent = () => {
    return axios.get(`${process.env.REACT_APP_HOST}ticketify/api/v1/list-event`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
const editEvent = (id, data) => {
    return axios.put(`${process.env.REACT_APP_HOST}ticketify/api/v1/update-event/${id}`, data,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
// Buyer
const createBuyer = (data) => {
    return axios.post(`${process.env.REACT_APP_HOST}ticketify/api/v1/create-buyer`, data);
}
const getListBuyer = () => {
    return axios.get(`${process.env.REACT_APP_HOST}ticketify/api/v1/list-buyer`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
const getBuyer = (id) => {
    return axios.get(`${process.env.REACT_APP_HOST}ticketify/api/v1/get-buyer/${id}`);
}
// Order
const createOrder = (data) => {
    return axios.post(`${process.env.REACT_APP_HOST}ticketify/api/v1/create-order`, data);
}
const getOrder = (id) => {
    return axios.get(`${process.env.REACT_APP_HOST}ticketify/api/v1/get-order/${id}`);
}
const getListOrder = () => {
    return axios.get(`${process.env.REACT_APP_HOST}ticketify/api/v1/list-order`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
// Tran
const create_transaction = (data) => {
    return axios.post(`${process.env.REACT_APP_HOST}ticketify/api/v1/create-transaction`, data);
}
export {
    getListBuyer, createBuyer, getBuyer,
    getListOrder, createOrder, getOrder,
    getEvent, create_transaction, getListEvent, editEvent
}