const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');

const oAuthen2Customer = require('../models/database/oAuthen2Customer.model.js');
var oauthen2=new oAuthen2Customer();
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
  let token;
  if (authorizationHeader) {
      token = authorizationHeader.split(' ')[1];
  }
  if (token) {
    oauthen2.checkInvalUserExistingTocken(token).then((user) => {
        req.currentUser = {
          customer_id:user[0].customer_id,
          enterprise_id:user[0].value_service,
          value_manifest:user[0].value_manifest
        };
        next();
      })
      .catch(function(err){
            res.status(HttpStatus.FORBIDDEN).json({
              error: 'No token provided',
            });
      });
    
  } 
  else {
    res.status(HttpStatus.FORBIDDEN).json({
      error: 'No token False', 
    });
  }
};
