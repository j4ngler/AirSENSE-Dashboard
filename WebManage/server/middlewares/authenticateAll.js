const isAuthenticated = require("../middlewares/authenticate.js");
const isAuthenticateCustomer = require("../middlewares/authenticateCustomer.js");
const oAuthen2Customer = require("../models/database/oAuthen2Customer.model.js");
const oAuthen2 = require("../models/database/oAuthen2.model.js");
const HttpStatus = require("http-status-codes");
var oauthen2 = new oAuthen2();
var oauthen2customer = new oAuthen2Customer();
function isAuthenticatedAll(req, res,next) {
    const authorizationHeader = req.headers["authorization"];
    console.log("auth",authorizationHeader)
    let token;
    if (authorizationHeader) {
        token = authorizationHeader.split(" ")[1];
    }
    if (token) {
        oauthen2customer
            .checkInvalUserExistingTocken(token)
            .then((user) => {
                req.currentUser = {
                    customer_id: user[0].customer_id,
                    enterprise_id: user[0].value_service,
                    value_manifest: user[0].value_manifest,
                };
                next();
            })
            .catch(function (err) {
                console.log("err",err)
                oauthen2.checkInvalUserExistingTocken(token)
                    .then((user) => {
                        req.currentUser = {
                            manifestid: user[0].permission_id,
                            users_id: user[0].user_id,
                            enterprise_id: user[0].enterprise_id,
                            value_manifest: user[0].value_manifest,
                        };
                        req.body = { ...req.body, id_created: user[0].user_id };
                        next();
                    })
                    .catch(function (err) {
                        console.log("err2",err)
                        res.status(HttpStatus.FORBIDDEN).json({
                            error: "No token provided",
                        });
                    });
            });
    }
    else {
        res.status(HttpStatus.FORBIDDEN).json({
            error: "No token False",
        });
    }
}
module.exports = { isAuthenticatedAll }