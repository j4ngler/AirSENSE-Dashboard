export const apiPath = 'api/';

export const APP_HOST = process.env.REACT_APP_HOST; //'103.130.212.210';//'178.128.221.254';//'localhost';// '103.1.238.175';
export const APP_PORT = process.env.REACT_APP_PORT;
export const HOST = `${APP_HOST}:${APP_PORT}/`;
export const HOST_HTTP = `http://${APP_HOST}:${APP_PORT}/`;

export const API_URL = `http://${HOST}${apiPath}`;
export const JWT_TOKEN = process.env.REACT_APP_JWT_TOKEN;
// http://127.0.0.1:3002
// export const HOST_HTTP_CHAT = 'http://103.130.212.210:3002/api/chat/';
// export const HOST_HTTP_HISTORY_CHAT = 'http://103.130.212.210:3002/api/history/';
export const HOST_HTTP_CHAT = process.env.REACT_APP_HOST_HTTP_CHAT; 
export const HOST_HTTP_HISTORY_CHAT = process.env.REACT_APP_HOST_HTTP_HISTORY_CHAT;
