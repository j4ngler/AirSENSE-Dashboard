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
  if(method === axiosMethod.GET){
   
  }
  else if(method === axiosMethod.DELETE){
    axiosConfig.params = {
      id: data
    };
  }
  else{
    console.log("gello posst");
    axiosConfig.data = data;
  }
  
  return axios(axiosConfig);
};
