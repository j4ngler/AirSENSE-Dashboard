const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var squel = require("squel");
const User = require("../models/database/user.model.js");
const Oauthen2 = require("../models/database/oAuthen2.model.js");
const Customer = require("../models/database/customer.model.js");
const OAuthen2Customer = require("../models/database/oAuthen2Customer.model.js");
const express = require("express");
console.log(__dirname)
const {
  returnOK,
  returnNotAuthen,
  returnNotFound,
} = require("../utils/returnResponse.js");
var oauthen2 = new Oauthen2();
var oAuthen2Customer = new OAuthen2Customer();
var lstLogin = [];
var lstLoginCustomer = [];
var ejs = require("ejs");
//reset password customer
const knex = require("../config/knex");
const { getRamdomData } = require("../utils/utilsString.js");
var nodemailer = require("nodemailer");
const option = {
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME, // email hoặc username
    pass: process.env.MAIL_PASSWORD, // password
  },
};
var transporter = nodemailer.createTransport(option);

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
  lstLogin = lstLogin.filter((o) => Date.now() - o.time < 2000);
  var emailExist = lstLogin.filter((o) => o.email == email);
  if (emailExist.length == 1) {
    return returnNotAuthen(res, {
      success: false,
      message: "Bạn dang đăng nhập tài khoản hơn 2 lần trong 1s.",
    });
  } else if (emailExist.length > 1) {
    return returnNotAuthen(res, {
      success: false,
      message: "Bạn dang đăng nhập tài khoản hơn 2 lần trong 1s.",
    });
  }

  console.log("email", email);

  User.query({
    where: { email: email, delete_flag: 0 },
  })
    .fetch({ require: false })
    .then((user) => {
      console.log(user);
      if (user) {
        lstLogin = lstLogin.filter((o) => o.email != email);
        console.log(user);
        bcrypt
          .compare(password, user.get("password"))
          .then(function (result) {
            // console.log("user Inval",result);
            if (result) oauthen2.responseLogin(res, user);
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

authCtrl.getTocken = function (req, res) {
  const authorizationHeader = req.headers["authorization"];
  let token;

  if (authorizationHeader) {
    token = authorizationHeader.split(" ")[1];
  }
  console.log("checkInvalUserExistingTocken token erro", token);
  if (token) {
    oauthen2
      .checkInvalUserExistingTocken(token)
      .then((user) => {
        console.log("checkInvalUserExistingTocken token user", user);
        res.status(HttpStatus.OK).json({ user: user[0] });
      })
      .catch(function (err) {
        return returnNotAuthen(res, { success: false, message: "No token ex" });
      });
  } else {
    return returnNotAuthen(res, { success: false, message: "No token False" });
  }
};

authCtrl.loginCustomer = function (req, res) {
  const { email, password } = req.body;
  lstLogin = lstLogin.filter((o) => Date.now() - o.time < 2000);
  var emailExist = lstLogin.filter((o) => o.email == email);
  if (emailExist.length == 1) {
    return returnNotAuthen(res, {
      success: false,
      message: "Bạn dang đăng nhập tài khoản hơn 2 lần trong 1s.",
    });
  } else if (emailExist.length > 1) {
    return returnNotAuthen(res, {
      success: false,
      message: "Bạn dang đăng nhập tài khoản hơn 2 lần trong 1s.",
    });
  }

  Customer.query({
    where: { email: email, delete_flag: 0 },
  })
    .fetch({ require: false })
    .then((user) => {
      if (user) {
        lstLogin = lstLogin.filter((o) => o.email != email);
        bcrypt
          .compare(password, user.get("password"))
          .then(function (result) {
            if (result) oAuthen2Customer.responseLogin(res, user);
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
  var stringTocken = request.headers["authorization"];
  var stringData = stringTocken.split("Bearer ");
  var data = squel
    .update()
    .table("oauthen2")
    .set("deleteflag", 1)
    .set("updated_at", "NOW()", { dontQuote: true })
    .where("tocken = '" + stringData[1] + "'");
  var SQL = data.toString();
  // mySQLConfig.queryDbSQL(SQL).then(function (result) {
  //     callback(true);f
  // })
  //     .catch(function (err) { callback(false, err); });
  // Oauthen2.query(SQL)
  console.log(SQL);
};

authCtrl.resetPassword = async (req, res) => {
  const email = req.body.email;
  try {
    await knex
      .raw("select * from customer where email= ?", [email])
      .then((userRaw) => {
        let user = userRaw[0];
        if (user.length > 0) {
          let userId = user[0].customer_id;
          let token = getRamdomData(90);
          const port = process.env.APP_PORT || 3000;
          const host = process.env.APP_HOST || "localhost";
          let URLtogetLink =
            `http://localhost:3006/api/auth/reset_password/${userId}?token=` +
            token;
          var content = "";
          var fs = require("fs"),
            file = fs.readFileSync(
              __dirname + "/../View/authen/sendEmailForgotPass.ejs",
              "utf-8"
            ),
            rendered = ejs.render(file, {
              username: user[0].fullname,
              url: URLtogetLink,
            });
          console.log(URLtogetLink);
          transporter.verify(function (error, success) {
            // Nếu có lỗi.
            if (error) {
              console.log(error);
            } else {
              //Nếu thành công.
              console.log("Kết nối thành công!");
              var mail = {
                from: process.env.MAIL_USERNAME,
                to: email,
                subject: "Reset password", // Tiêu đề mail
                text: "You recieved message from AIRSENSE",
                attachment: [{
                  filename: "airsense.jpg",
                  path: `${__dirname}/../../public/resource/airsense/wp-content/img/airsense.jpg`,
                  cid: "logo",
                }],
                html: rendered,
              };
            }
            //Tiến hành gửi email
            transporter.sendMail(mail, async (error, info) => {
              if (error) {
                // nếu có lỗi
                console.log(error);
                req.send("mess", "Lỗi gửi mail: " + err); //Gửi thông báo đến người dùng
                res.redirect("/");
              } else {
                //nếu thành công
                console.log("Email sent: " + info.response);
                await knex
                  .raw(`select * from reset_password where user_id= ?`, [
                    userId,
                  ])
                  .then(async (user) => {
                    console.log("Ton tai");
                    if (user[0].length > 0) {
                      var deleteSquel = squel
                        .delete()
                        .from("reset_password")
                        .where(`user_id=?`, [userId]);
                      await knex
                        .raw(deleteSquel.toString())
                        .then((userDelete) => {
                          if (userDelete) {
                            console.log("Xoa thanh cog");
                          } else {
                            console.log("Loi");
                          }
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }
                  });
                var authen2 = squel
                  .insert()
                  .into("reset_password")
                  .set("id", 1)
                  .set("user_type", 2)
                  .set("user_id", userId)
                  .set("token_reset", token)
                  .set("delete_flag", 0)
                  .set("created_at", "NOW()", { dontQuote: true })
                  .set("time_release", "NOW() + INTERVAL 1 HOUR", {
                    dontQuote: true,
                  });
                console.log(authen2.toString());
                await knex
                  .raw(authen2.toString())
                  .then(function (data) {
                    res.json({
                      success: true,
                      message: "Gửi email thành công",
                    });
                  })
                  .catch(function (err) {
                    res.status(HttpStatus.UNAUTHORIZED).json({
                      success: false,
                      message: "Problem SQL.",
                    });
                  });
              }
            });
          });
        } else {
          res.status(HttpStatus.NOT_FOUND).json({ message: "No such user" });
        }
      });
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.BAD_GATEWAY).json({ message: "Loi server" });
  }
};
authCtrl.newPassword = async (req, res) => {
  const dataUser = req.body.data;

  var checkToken = `SELECT token_reset from reset_password WHERE user_id = ${dataUser.user_id} AND created_at > date_sub(now(), interval 1 hour)`;
  var result = await knex.raw(checkToken.toString());
  if (!result) {
    console.log("Quá thời gian quy định, xin yêu cầu gửi email lại ");
  } else {
    const tokenDB = result[0][0].token_reset;
    console.log(tokenDB);
    console.log(dataUser.token);
    if (tokenDB === dataUser.token) {
      var authen = squel
        .update()
        .table("customer")
        .where("customer_id=?", squel.str(dataUser.user_id))
        .set("password", squel.str(dataUser.password))
        .toString();
      console.log("updateDataauthen.toString() ", authen);
      knex
        .raw(authen.toString())
        .then(function (x) {
          console.log("Đổi mật khẩu thành công");
          return res.status(200).json({
            message: "Đổi mật khẩu thành công",
          });
        })
        .catch(function (err) {
          console.log(err);
          return res.status(500).json({
            message: "Đã có lỗi xảy ra",
          });
        });
    } else {
      console.log("Quá thời gian quy định, xin yêu cầu gửi email lại");
    }
  }
};
module.exports = authCtrl;
