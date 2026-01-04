const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
const Oauthen2 = require("../models/database/oAuthen2.model.js");
var oauthen2 = new Oauthen2();

/**
 * Route authentication middleware (ĐÃ ĐƠN GIẢN HÓA ĐỂ TEST)
 *
 * LƯU Ý QUAN TRỌNG:
 * - Hiện tại middleware này luôn cho phép request đi qua (không kiểm tra token).
 * - Chỉ dùng cho MỤC ĐÍCH TEST nội bộ.
 * - Khi deploy thật, cần khôi phục lại logic kiểm tra JWT bên dưới (đang được comment).
 */
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

/**
 * Logic gốc sử dụng JWT (ĐÃ COMMENT LẠI, THAM KHẢO)
 *
 * module.exports = (req, res, next) => {
 *   const authorizationHeader = req.headers["authorization"];
 *   let token;
 *   if (authorizationHeader) {
 *     token = authorizationHeader.split(" ")[1];
 *   }
 *   if (token) {
 *     oauthen2
 *       .checkInvalUserExistingTocken(token)
 *       .then((user) => {
 *         req.currentUser = {
 *           manifestid: user[0].permission_id,
 *           user_id: user[0].user_id,
 *           enterprise_id: user[0].enterprise_id,
 *           value_manifest: user[0].value_manifest,
 *         };
 *         req.body = { ...req.body, id_created: user[0].user_id };
 *         next();
 *       })
 *       .catch(function (err) {
 *         res.status(HttpStatus.FORBIDDEN).json({
 *           error: "No token provided",
 *         });
 *       });
 *   } else {
 *     res.status(HttpStatus.FORBIDDEN).json({
 *       error: "No token provided",
 *     });
 *   }
 * };
 *
 */

