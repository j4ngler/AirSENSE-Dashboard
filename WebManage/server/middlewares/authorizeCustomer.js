const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");

const oAuthen2Customer = require("../models/database/oAuthen2Customer.model.js");
var oauthen2 = new oAuthen2Customer();
/**
 * Route authentication middleware to verify a token
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 *
 */

module.exports = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  const permissionValue = req.headers["x-authorized-permission"];
  if (!permissionValue) {
    res
      .status(HttpStatus.FAILED_DEPENDENCY)
      .json({ message: "You have no permission!" });
  }
  let token;
  if (authorizationHeader) {
    token = authorizationHeader.split(" ")[1];
  }
  if (token) {
    oauthen2
      .checkInvalUserExistingTocken(token)
      .then((user) => {
        req.currentUser = {
          customer_id: user[0].customer_id,
          enterprise_id: user[0].value_service, // tất cả các quyền của customer
          value_manifest: user[0].value_manifest,
        };
        // Mảng tất cả các quyền của user
        const allServiceCustomer = user[0].value_service.split(",");

        //Quyền sau khi lọc trùng với loại quyền của customer (1 quyền)
        let serviceCustomerFilter;
        allServiceCustomer.forEach((serviceCustomer) => {
          if (serviceCustomer.slice(0, -1) === permissionValue.slice(0, -1)) {
            serviceCustomerFilter = parseInt(serviceCustomer.split("/")[1]);
          }
        });
        console.log(serviceCustomerFilter);
        //Nếu quyền customer <= quyền yêu cầu từ client
        if (serviceCustomerFilter <= parseInt(permissionValue.split("/")[1])) {
          next();
        } else {
          res
            .status(HttpStatus.FAILED_DEPENDENCY)
            .json({ message: "You have no permission!" });
        }
      })
      .catch(function (err) {
        res.status(HttpStatus.FORBIDDEN).json({
          error: "No token provided",
        });
      });
  } else {
    res.status(HttpStatus.FORBIDDEN).json({
      error: "No token False",
    });
  }
};
