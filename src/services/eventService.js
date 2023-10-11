import api_admin from '../auths/api_admin';
import api_user from '../auths/api_user';
// Event
const getEvent = () => {
    return api_user.get(`ticketify/api/v1/get-event/${process.env.REACT_APP_EVENT_CODE}`);
}
const getListEvent = () => {
    return api_admin.get(`ticketify/api/v1/list-event`,);
}
const editEvent = (id, data) => {
    return api_admin.put(`ticketify/api/v1/update-event/${id}`, data,);
}
// Buyer
const createBuyer = (data) => {
    return api_user.post(`ticketify/api/v1/create-buyer`, data);
}
const getListBuyer = () => {
    return api_admin.get(`ticketify/api/v1/list-buyer`,);
}
const getBuyer = (id) => {
    return api_admin.get(`ticketify/api/v1/get-buyer/${id}`);
}
// Order
const createOrder = (data) => {
    return api_user.post(`ticketify/api/v1/create-order`, data);
}
const createOrderStaff = (data) => {
    return api_admin.post(`ticketify/api/v1/create-order`, data,);
}
const getOrder = (id) => {
    return api_admin.get(`ticketify/api/v1/get-order/${id}`);
}
const getListOrder = () => {
    return api_admin.get(`ticketify/api/v1/list-order`,);
}
// Tran
const createTransaction = (data) => {
    return api_user.post(`ticketify/api/v1/create-transaction`, data);
}
// Ticket
const getTicket = (id) => {
    return api_admin.get(`ticketify/api/v1/get-ticket/${id}`,);
}
const createTicket = (data) => {
    return api_admin.post(`ticketify/api/v1/create-ticket`, data,);
}
const editTicket = (data, id) => {
    return api_admin.put(`ticketify/api/v1/update-ticket/${id}`, data,);
}
const getListTicket = () => {
    return api_admin.get(`ticketify/api/v1/list-ticket`,);
}
// Student
const createStudent = (data) => {
    return api_admin.post(`ticketify/api/v1/create-student`, data,);
}
export {
    getListBuyer, createBuyer, getBuyer,
    getListOrder, createOrder, getOrder, createOrderStaff,
    getEvent, createTransaction, getListEvent, editEvent,
    createTicket, getTicket, editTicket, getListTicket,
    createStudent,
}