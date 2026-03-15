const knex = require("../../config/knex.js");
const squel = require("squel");
const jwt = require("jsonwebtoken");
const { getRamdomData } = require("../../utils/utilsString.js");
const TableManifest = require("../middlewareDatabase/TableManifest.js");
const HttpStatus = require("http-status-codes");
const { returnOK, returnNotAuthen } = require("../../utils/returnResponse.js");

class Oauthen2 {
  checkInvalUserExistingTocken(token) {
    var authen = squel
      .select()
      .from("oauthen2")
      .where("token = '" + token + "'")
      .where("delete_flag = 0")
      .where("time_release > NOW()");
    return new Promise((resolve, reject) => {
      knex
        .raw(authen.toString())
        .then(function (result) {
          resolve(result[0]);
        })
        .catch(function (err) {
          console.log("checkInvalUserExistingTocken error");
          return reject(err);
        });
    });
  }

  responseLogin(res, user) {
    var dataTocken = getRamdomData(256);
    var manifestid = user.get("permission_id");
    var current_id = user.get("user_id");
    var authen2 = squel
      .insert()
      .into("oauthen2")
      .set("permission_id", manifestid)
      .set("user_id", current_id)
      .set("token", dataTocken)
      .set("delete_flag", 0)
      .set("created_at", "NOW()", { dontQuote: true })
      .set("time_release", "NOW() + INTERVAL 1 DAY", { dontQuote: true });

    if (manifestid <= TableManifest.NEW_REGISTER) {
      knex
        .raw(authen2.toString())
        .then(function (x) {
          res.json({
            success: true,
            token: dataTocken,
            email: user.get("email"),
            user_id: current_id,
            permission_id: manifestid,
          });
        })
        .catch(function (err) {
          console.log("responseLogin error:", err);
          return returnNotAuthen(res, {
            success: false,
            message: "Lỗi khi tạo token",
          });
        });
    } else {
      return returnNotAuthen(res, {
        success: false,
        message: "Tài khoản chưa được kích hoạt",
      });
    }
  }

  deleteTocken(token) {
    var authen = squel
      .update()
      .table("oauthen2")
      .set("delete_flag", 1)
      .where("token = '" + token + "'");
    return new Promise((resolve, reject) => {
      knex
        .raw(authen.toString())
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          return reject(err);
        });
    });
  }
}

module.exports = Oauthen2;

