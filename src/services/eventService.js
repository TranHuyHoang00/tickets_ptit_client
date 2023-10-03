import axios from "axios";
import { GetLocal_Token } from '../auth/localStorage';

// Event
const getEvent = () => {
    return axios.get(`${process.env.REACT_APP_HOST}ticketify/api/v1/get-event/${process.env.REACT_APP_EVENT_CODE}`);
}
const getListEvent = () => {
    let token = GetLocal_Token()
    return axios.get(`${process.env.REACT_APP_HOST}ticketify/api/v1/list-event`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
const editEvent = (id, data) => {
    let token = GetLocal_Token()
    return axios.put(`${process.env.REACT_APP_HOST}ticketify/api/v1/update-event/${id}`, data,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
// Buyer
const createBuyer = (data) => {
    return axios.post(`${process.env.REACT_APP_HOST}ticketify/api/v1/create-buyer`, data);
}
const getListBuyer = () => {
    let token = GetLocal_Token()
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
const createOrderStaff = (data) => {
    let token = GetLocal_Token()
    return axios.post(`${process.env.REACT_APP_HOST}ticketify/api/v1/create-order`, data,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
const getOrder = (id) => {
    return axios.get(`${process.env.REACT_APP_HOST}ticketify/api/v1/get-order/${id}`);
}
const getListOrder = () => {
    let token = GetLocal_Token()
    return axios.post(`${process.env.REACT_APP_HOST}ticketify/api/v1/list-order`, {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
// Tran
const createTransaction = (data) => {
    return axios.post(`${process.env.REACT_APP_HOST}ticketify/api/v1/create-transaction`, data);
}
// Ticket
const getTicket = (id) => {
    let token = GetLocal_Token()
    return axios.get(`${process.env.REACT_APP_HOST}ticketify/api/v1/get-ticket/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
const createTicket = (data) => {
    let token = GetLocal_Token()
    return axios.post(`${process.env.REACT_APP_HOST}ticketify/api/v1/create-ticket`, data,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}
export {
    getListBuyer, createBuyer, getBuyer,
    getListOrder, createOrder, getOrder, createOrderStaff,
    getEvent, createTransaction, getListEvent, editEvent,
    createTicket, getTicket,
}