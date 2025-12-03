export const apiPath = 'api/';

export const APP_HOST = '127.0.0.1'; //'103.130.212.210';//'178.128.221.254';//'localhost';// '103.1.238.175';
export const APP_PORT = '3002';
export const HOST = `${APP_HOST}:${APP_PORT}/`;
export const HOST_HTTP = `http://${APP_HOST}:${APP_PORT}/`;
export const API_URL = `http://${HOST}${apiPath}`;
export const JWT_TOKEN = process.env.REACT_APP_JWT_TOKEN;
// http://127.0.0.1:3002
// export const HOST_HTTP_CHAT = 'http://103.130.212.210:3002/api/chat/';
// export const HOST_HTTP_HISTORY_CHAT = 'http://103.130.212.210:3002/api/history/';
export const HOST_HTTP_CHAT = process.env.REACT_APP_HOST_HTTP_CHAT; 
export const HOST_HTTP_HISTORY_CHAT = process.env.REACT_APP_HOST_HTTP_HISTORY_CHAT;

export const HOST_HTTP_COMMENT = 'http://localhost:3002/api'; 

export const HOST_HTTP_ATTENDANCE = 'http://127.0.0.1:3003/api/attendance';
