const express = require("express");
const {API_LOPGIN, API_GET_USER, API_LOGIN} =require('../config/configApi');
const axios = require('axios');



class AxiosSupport {

    login(api, email, password){
        return axios.post(api,{
            email: email,
            password: password
        })
    }

    getInformationUser(api,token){
        return axios.get(api,{
            headers: {
                authorization: `Bearer ${token}`
            }
        })
    }
}

module.exports = new AxiosSupport


