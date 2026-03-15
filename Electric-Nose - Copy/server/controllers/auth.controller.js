const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/database/user.model.js");
const Oauthen2 = require("../models/database/oAuthen2.model.js");
const {
  returnOK,
  returnNotAuthen,
  returnNotFound,
} = require("../utils/returnResponse.js");
var oauthen2 = new Oauthen2();
var lstLogin = [];

var authCtrl = {};

/**
 * Returns jwt token if valid email and password is provided
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
authCtrl.login = function (req, res) {
  const { email, password } = req.body;
  console.log("Login attempt:", email);
  lstLogin = lstLogin.filter((o) => Date.now() - o.time < 2000);
  var emailExist = lstLogin.filter((o) => o.email == email);
  if (emailExist.length >= 1) {
    return returnNotAuthen(res, {
      success: false,
      message: "Bạn đang đăng nhập tài khoản quá nhiều lần trong 1s.",
    });
  }
  User.query({
    where: { email: email, delete_flag: 0 },
  })
    .fetch({ require: false })
    .then((user) => {
      if (user) {
        lstLogin = lstLogin.filter((o) => o.email != email);
        bcrypt
          .compare(password, user.get("password"))
          .then(function (result) {
            if (result) {
              oauthen2.responseLogin(res, user);
            }
            else
              return returnNotAuthen(res, {
                success: false,
                message: "Authentication failed. Invalid password",
              });
          })
          .catch(() => {
            return returnNotAuthen(res, {
              success: false,
              message: "Authentication failed. Invalid password",
            });
          });
      } else {
        lstLogin.push({ email: email, count: 1, time: Date.now() });
        return returnNotAuthen(res, {
          success: false,
          message: "Invalid username or password.",
        });
      }
    });
};

authCtrl.logOut = function (req, res) {
  const authorizationHeader = req.headers["authorization"];
  let token;
  if (authorizationHeader) {
    token = authorizationHeader.split(" ")[1];
  }
  if (token) {
    oauthen2
      .deleteTocken(token)
      .then(() => {
        return returnOK(res, {
          success: true,
          message: "Logout successfully",
        });
      })
      .catch(() => {
        return returnOK(res, {
          success: true,
          message: "Logout successfully",
        });
      });
  } else {
    return returnOK(res, {
      success: true,
      message: "Logout successfully",
    });
  }
};

module.exports = authCtrl;

