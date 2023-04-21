const express = require("express");
const {
    returnOK,
    returnNotAuthen,
    returnNotFound,
  } = require("../../utils/returnResponse.js");
const Oauthen2 = require("../../models/database/oAuthen2.model.js");

const User = require("../../models/database/user.model.js");
const bcrypt = require("bcrypt");
const { use } = require("../../routes/authentication.route.js");

var oauthen2 = new Oauthen2();
var lastLoginTimes = []
class AuthenticationController {
    
    
    // POST: Login 
    login(req,res) {
        const {email, password} = req.body;
        lastLoginTimes = lastLoginTimes.filter((item) => Date.now() - item.item < 2000);
        var emailExist = lastLoginTimes.filter((o) => o.email == email);
        if(emailExist >=1 ){
            return returnNotAuthen(res,{
                success: false,
                message: "Bạn dang đăng nhập tài khoản hơn 2 lần trong 1s.",
            });
        }
        User.query({where: {email: email, delete_flag: 0}})
        .fetch({require: false})
            .then(user => {
                if(user){
                    lastLoginTimes = lastLoginTimes.filter((item) => Date.now() - item.item < 2000);
                    res.send(JSON.stringify(user.get("password")))
                    bcrypt.compare(password,user.get("password"))
                        .then(result=> { 

                            if(result){
                                oauthen2.responseLogin(res,user);
                            }
                            else{
                                return returnNotAuthen(res, {
                                    success: false,
                                    message: "Authentication failed. Invalid password1",
                                  });
                            }
                            
                        })
                        .catch(() => {
                            return returnNotAuthen(res, {
                              success: false,
                              message: "Authentication failed. Invalid password2",
                            });
                          });
                }
                else {
                    lastLoginTimes.push({ email: email, count: 1, time: Date.now() });
                    return returnNotAuthen(res, {
                      success: false,
                      message: "Invalid username or password3.",
                    });
                  }
            })
            .catch(error => res.send(JSON.stringify(error)))
    }
    
}
module.exports = new AuthenticationController;
