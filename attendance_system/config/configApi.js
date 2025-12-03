const apiPath = 'api';

const APP_HOST ='localhost';// '103.130.212.210';//'178.128.221.254';//'localhost';// '103.1.238.175';
const APP_PORT = 3000;
const HOST = `${APP_HOST}:${APP_PORT}/`;
const HOST_HTTP = `http://${APP_HOST}:${APP_PORT}/`;
const API_URL = `http://${HOST}${apiPath}`;
const API_LOGIN = `${API_URL}/auth/login`;
const API_GET_USER = `${API_URL}/auth/user`;
const API_GET_LIST_USER = `${API_URL}/users/list-users`;
const API_LOGIN_CUSTOMER = `${API_URL}/auth/customer/login`;
const API_GET_USER_CUSTOMER = `${API_URL}/auth/customer`;


module.exports = { API_URL, API_GET_USER, API_LOGIN, API_LOGIN_CUSTOMER, API_GET_USER_CUSTOMER, API_GET_LIST_USER }


