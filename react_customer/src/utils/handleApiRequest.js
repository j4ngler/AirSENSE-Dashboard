import axios from 'axios';

export const axiosMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export const axiosRequest = (url, method, token, data) => {
  const axiosConfig = {
    url,
    method,
    headers: {}
  };
  if (method !== axiosMethod.GET) {
    axiosConfig.headers['Content-Type'] = `application/json`;
  }
  if (token) {
    axiosConfig.headers['Authorization'] = `Bearer ${token}`;
    axiosConfig.headers['X-XSRF-TOKEN'] = token;
  }
  axiosConfig.data = data;
  // console.log(axiosConfig);
  return axios(axiosConfig);
};
