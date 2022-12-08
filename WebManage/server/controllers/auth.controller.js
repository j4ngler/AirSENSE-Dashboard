const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var squel = require("squel");
const User = require('../models/database/user.model.js');
const Oauthen2 = require('../models/database/oAuthen2.model.js');
const Customer = require('../models/database/customer.model.js')
const OAuthen2Customer = require('../models/database/oAuthen2Customer.model.js');
const {returnOK,returnNotAuthen,returnNotFound } = require('../utils/returnResponse.js');
var oauthen2=new Oauthen2();
var oAuthen2Customer=new OAuthen2Customer();
var lstLogin=[];
var lstLoginCustomer=[];
var authCtrl={};
/**
 * Returns jwt token if valid email and password is provided
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
 authCtrl.login = function(req, res) {
  const { email, password } = req.body;
  lstLogin =lstLogin.filter(o=>((Date.now() - o.time)<2000));
  var emailExist=lstLogin.filter(o=>o.email==email);
  if(emailExist.length==1){
    return returnNotAuthen(res,{success: false,message: 'Bạn dang đăng nhập tài khoản hơn 2 lần trong 1s.'});
  }
  else if(emailExist.length>1)
  {
    return returnNotAuthen(res,{success: false,message: 'Bạn dang đăng nhập tài khoản hơn 2 lần trong 1s.'});
  }

  console.log('email', email)

  User.query({
    where: {email: email, delete_flag: 0}
  })
    .fetch({ require: false })
    .then((user) => {
      console.log(user)
      if (user) {
        lstLogin =lstLogin.filter(o=>o.email!=email);
        console.log(user);
        bcrypt.compare(password,  user.get('password')).then(function(result) {
          // console.log("user Inval",result);
          if(result)
            oauthen2.responseLogin(res,user);        
          else
            return returnNotAuthen(res,{success: false,message:'Authentication failed. Invalid password'});
        })
        .catch(()=>{
          return returnNotAuthen(res,{success: false,message:'Authentication failed. Invalid password'});
        });
      } else {
        lstLogin.push({email:email,count:1,time:Date.now()});
        return returnNotAuthen(res,{success: false,message:'Invalid username or password.'});
      }
    });
 }



authCtrl.getTocken = function(req, res) {
  const authorizationHeader = req.headers['authorization'];
  let token;
  
  if (authorizationHeader) {
      token = authorizationHeader.split(' ')[1];
  }
  console.log("checkInvalUserExistingTocken token erro",token);
  if (token) {
      oauthen2.checkInvalUserExistingTocken(token).then((user) => {
        console.log("checkInvalUserExistingTocken token user",user);
        res.status(HttpStatus.OK).json({ user:user[0]});
      })
      .catch(function(err){
        return returnNotAuthen(res,{success: false,message:'No token ex'});
      });
  } else {
    return returnNotAuthen(res,{success: false,message:'No token False'});
  }
}


authCtrl.loginCustomer = function(req, res) {
  const { email, password } = req.body;
  lstLogin =lstLogin.filter(o=>((Date.now() - o.time)<2000));
  var emailExist=lstLogin.filter(o=>o.email==email);
  if(emailExist.length==1){
    return returnNotAuthen(res,{success: false,message: 'Bạn dang đăng nhập tài khoản hơn 2 lần trong 1s.'});
  }
  else if(emailExist.length>1)
  {
    return returnNotAuthen(res,{success: false,message: 'Bạn dang đăng nhập tài khoản hơn 2 lần trong 1s.'});
  }

  Customer.query({
    where: {email:email, deleteflag: 0}
  })
    .fetch({ require: false })
    .then((user) => {
      if (user) {
        lstLogin =lstLogin.filter(o=>o.email!=email);
        console.log(user);
        const userPassword = user.get('password');
        console.log("user Inval",userPassword);
        if(password==userPassword) {
          oAuthen2Customer.responseLogin(res,user); 
        }
        else{
            return returnNotAuthen(res,{success: false,message:'Authentication failed. Invalid password'});
        }

      } 
        else {
        lstLogin.push({email:email,count:1,time:Date.now()});
        return returnNotAuthen(res,{success: false,message:'Invalid username or password.'});
      }
    });
}


authCtrl.logOut = function(req, res) {
  var stringTocken = request.headers["authorization"];
        var stringData = stringTocken.split("Bearer ");
        var data = squel.update().table("oauthen2").set("deleteflag", 1)
            .set("updated_at", "NOW()", { dontQuote: true }).where("tocken = '" + stringData[1] + "'");
        var SQL = data.toString();
        // mySQLConfig.queryDbSQL(SQL).then(function (result) {
        //     callback(true);
        // })
        //     .catch(function (err) { callback(false, err); });
        // Oauthen2.query(SQL)
        console.log(SQL);

}


module.exports =authCtrl;