const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
const Oauthen2 = require("../models/database/oAuthen2.model.js");
var oauthen2 = new Oauthen2();

/**
 * Route authentication middleware to verify a token
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 *
 */

// Middleware đơn giản hóa cho mục đích TEST:
// - Luôn cho phép request đi qua, gán sẵn req.currentUser.
// - KHÔNG kiểm tra JWT/token.
// Khi deploy thật, nên khôi phục lại logic cũ (xem file authenticate.new.js để tham khảo).
module.exports = (req, res, next) => {
  req.currentUser = {
    manifestid: 1,
    user_id: 1,
    enterprise_id: 1,
    value_manifest: "admin",
  };
  req.body = { ...req.body, id_created: req.currentUser.user_id };
  return next();
};

