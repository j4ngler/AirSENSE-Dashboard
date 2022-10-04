const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();
const Oauthen2 = require('../models/database/oAuthen2.model.js');
var oauthen2=new Oauthen2();
var squel = require("squel");
const knex = require('../config/knex.js');

/**
 * Route authentication middleware to verify a token
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 *
 */

module.exports =  (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  var token="";

  if (authorizationHeader) {
      token = authorizationHeader.split(' ')[1];
      console.log(token);
  }

  if (token) {
    oauthen2.checkInvalUserExistingTocken(token).then((user) => {
      if(user.length == 0)  {
        var headers = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': token,
            authorization: 'Beard '+ token,
          }
        };
        axios.get( process.env.ADMIN_API +"auth/tocken",headers)
        .then(data =>{
      //    console.log("checkInvalUserExistingTocken data",data.data);
              oauthen2.addTocken(data.data.user).then(info =>{
                //console.log("checkInvalUserExistingTocken info",info);
                    req.currentUser = {
                      permission_id:data.data.user.permission_id,
                      users_id:data.data.user.userid,
                      enterprise_id:data.data.user.enterprise_id,
                      value_manifest:data.data.user.value_manifest
                    };
                    next();
                })
                .catch(err=>{ res.status(HttpStatus.METHOD_FAILURE).json({ error: 'No token ', });});
        })
        .catch(err=>{ 
        //  console.log("checkInvalUserExistingTocken 2",err.response);
            res.status(HttpStatus.METHOD_FAILURE).json({
              error: 'No token',
            });
        })
      }
      if(user.length > 0) {
      console.log("checkInvalUserExistingTocken1111 user",user);
        req.currentUser = {
          permission_id:user[0].permission_id, 
          users_id:user[0].userid,
          enterprise_id:user[0].enterprise_id,
          value_manifest:user[0].value_manifest
        };
        next();
      }
            
        
      })
      .catch(function(err){
          var headers = {
                          headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'X-XSRF-TOKEN': token,
                            authorization: 'Beard '+ token,
                          }
                        };
          //console.log("checkInvalUserExistingTocken 2", process.env.ADMIN_API +"auth/tocken");
          
          axios.get( process.env.ADMIN_API +"auth/tocken",headers)
            .then(data =>{
          //    console.log("checkInvalUserExistingTocken data",data.data);
                  oauthen2.addTocken(data.data.user).then(info =>{
                    //console.log("checkInvalUserExistingTocken info",info);
                        req.currentUser = {
                          permission_id:data.data.user.permission_id,
                          users_id:data.data.user.userid,
                          enterprise_id:data.data.user.enterprise_id,
                          value_manifest:data.data.user.value_manifest
                        };
                        next();
                    })
                    .catch(err=>{ res.status(HttpStatus.METHOD_FAILURE).json({ error: 'No token ', });});
            })
            .catch(err=>{ 
            //  console.log("checkInvalUserExistingTocken 2",err.response);
                res.status(HttpStatus.METHOD_FAILURE).json({
                  error: 'No token',
                });
            })
      });
  } else {
    //console.log("checkInvalUserExistingTocken token erro");
    res.status(HttpStatus.METHOD_FAILURE).json({
      error: 'No token False',
    });
  }
};
