const Oauthen2 = require("../../models/database/oAuthen2.model.js");
const {API_LOGIN, API_GET_USER, API_LOGIN_CUSTOMER, API_GET_USER_CUSTOMER, API_GET_LIST_USER} = require("../../config/configApi.js")
const oauthen2 = new Oauthen2();
const AxiosSupport = require('../../utils/axiosSupport.js')
const Oauthen2Customer = require("../../models/database/oAuthen2Customer.model.js")
const oAuthen2Customer = new Oauthen2Customer()

class AuthenticationController {
    // POST: Login admin 
   login(req,res) {
        const {email, password} = req.body;
        AxiosSupport.postMethod(API_LOGIN,email,password)
            .then((result) => {
                if(result.data?.success === true){
                    oauthen2.actionLogin(result.data.token)
                }
                res.json(result.data);
            })
            .catch(error => res.json(error))
    }
    // GET: Get user information
    getUserInformation(req,res){
        let token = req.headers['authorization'].split(' ')[1];
        AxiosSupport.getMethod(API_GET_USER,token)
            .then((result) => res.json(result.data.user))
            .catch(error => console.log(error))
    }
    // POST: Login customer
    loginCustomer(req,res){
        const {email, password} = req.body;
        AxiosSupport.postMethod(API_LOGIN_CUSTOMER,email,password)
            .then((result)=>{
                if(result.data?.success === true){
                    oAuthen2Customer.actionLogin(result.data.token)
                }
                res.json(result.data)
            })
            .catch(error => res.json(error))
    }
    // GET: Get customer information
    getCustomerInformation(req, res){
        let token = req.headers['authorization'].split(' ')[1];
        AxiosSupport.getMethod(API_GET_USER_CUSTOMER,token)
            .then((result) => res.json(result.data))
            .catch(error => console.log(error))
    }
    // GET: Get list user
    getListUsers(req,res){
        let token = req.headers['authorization'].split(' ')[1];
        AxiosSupport.getMethod(API_GET_LIST_USER,token)
           .then((result) => res.json(result.data))
           .catch(error => console.log(error))
    }
    
}
module.exports = new AuthenticationController;
