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
          permission_id:user[0].permission_id,
          customer_id:user[0].customer_id,
          enterprise_id:user[0].enterprise_id,
          value_manifest:user[0].value_manifest
        };
        next();
      })
      .catch(function(err){
            res.status(HttpStatus.FORBIDDEN).json({
              error: 'No token provided',
            });
      });
    /*jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ error: 'You are not authorized to perform this operation!' });
      } else {
        User.query({
          where: { users_id: decoded.id },
          select: [
            'users_id',
            'email',
            'username',
            'phone',
            'avatar',
            'fullname',
            'birthday',
            'passport',
            'address',
          ],
        })
          .fetch({ require: false })
          .then((user) => {
            if (!user) {
              res.status(HttpStatus.NOT_FOUND).json({ error: 'No such user' });
            } else {
              req.currentUser = user;
              next();
            }
          });
      }
    });*/
  } else {
    res.status(HttpStatus.FORBIDDEN).json({
      error: 'No token False',
    });
  }
};
