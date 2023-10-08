import api from '../auth/axiosInterceptor';
import axios from "axios";
import { GetLocal_Token } from '../auth/localStorage';
// Event
const getEvent = () => {
    return api.get(`ticketify/api/v1/get-event/${process.env.REACT_APP_EVENT_CODE}`);
}
const getListEvent = () => {
    return api.get(`ticketify/api/v1/list-event`,);
}
const editEvent = (id, data) => {
    return api.put(`ticketify/api/v1/update-event/${id}`, data,);
}
// Buyer
const createBuyer = (data) => {
    return api.post(`ticketify/api/v1/create-buyer`, data);
}
const getListBuyer = () => {
    return api.get(`ticketify/api/v1/list-buyer`,);
}
const getBuyer = (id) => {
    return api.get(`ticketify/api/v1/get-buyer/${id}`);
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
    return api.get(`ticketify/api/v1/get-order/${id}`);
}
const getListOrder = () => {
    return api.get(`ticketify/api/v1/list-order`,);
}
// Tran
const createTransaction = (data) => {
    return api.post(`ticketify/api/v1/create-transaction`, data);
}
// Ticket
const getTicket = (id) => {
    return api.get(`ticketify/api/v1/get-ticket/${id}`,);
}
const createTicket = (data) => {
    return api.post(`ticketify/api/v1/create-ticket`, data,);
}
const editTicket = (data, id) => {
    return api.put(`ticketify/api/v1/update-ticket/${id}`, data,);
}
const getListTicket = () => {
    return api.get(`ticketify/api/v1/list-ticket`,);
}
// Student
const createStudent = (data) => {
    return api.post(`ticketify/api/v1/create-student`, data,);
}
export {
    getListBuyer, createBuyer, getBuyer,
    getListOrder, createOrder, getOrder, createOrderStaff,
    getEvent, createTransaction, getListEvent, editEvent,
    createTicket, getTicket, editTicket, getListTicket,
    createStudent,
}