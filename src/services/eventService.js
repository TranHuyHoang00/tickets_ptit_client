import axios from "axios";

const getEvent = () => {
    return axios.get(`${process.env.REACT_APP_HOST}ticketify/api/v1/get-event/${process.env.REACT_APP_EVENT_CODE}`);
}
const create_buyer = (data) => {
    return axios.post(`${process.env.REACT_APP_HOST}ticketify/api/v1/create-buyer`, data);
}
const create_order = (data) => {
    return axios.post(`${process.env.REACT_APP_HOST}ticketify/api/v1/create-order`, data);
}
const getOrder_Id = (id) => {
    return axios.get(`${process.env.REACT_APP_HOST}ticketify/api/v1/get-order/${id}`);
}
const create_transaction = (data) => {
    return axios.post(`${process.env.REACT_APP_HOST}ticketify/api/v1/create-transaction`, data);
}
export {
    getEvent, create_buyer, create_order, getOrder_Id, create_transaction
}