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
  axiosConfig.headers['Content-Type'] = `application/json`;
  if (token) {
    axiosConfig.headers['authorization'] = `Bearer ${token}`;
    axiosConfig.headers['X-XSRF-TOKEN'] = token;
  }
  if(method === axiosMethod.GET || method === axiosMethod.DELETE){
    
    axiosConfig.query = data;
  }
  else{
    axiosConfig.data = data;
  }
  
  return axios(axiosConfig);
};
