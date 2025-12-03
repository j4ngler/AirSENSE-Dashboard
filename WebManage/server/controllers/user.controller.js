// const bcrypt = require("bcryptjs");
const express = require("express");
const HttpStatus = require("http-status-codes");
const knex = require("../config/knex.js");
var squel = require("squel");
const nodemailer = require("nodemailer");
const TableManifest = require("../models/middlewareDatabase/TableManifest.js");
const { mangerModelAdmin } = require("../models/database/managerAll.model.js");
const {
  returnOK,
  returnFalse,
  returnNotFound,
} = require("../utils/returnResponse.js");
const User = require("../models/database/user.model.js");
const Authen2 = require("../models/database/oAuthen2.model");
const { getRamdomData } = require("../utils/utilsString.js");
const { select } = require("squel");
const { useRouteMatch } = require("react-router-dom");
const bcrypt = require("bcryptjs");
var user = new User();

var userCtrl = {};

userCtrl.getTableData = function (req, res) {
  var startPage = 0;
  if (!!req.body.startPage) startPage = req.body.startPage;
  var tableSelect = mangerModelAdmin(req.body.table);
  console.log("current", req.currentUser);
  console.log("req", req.body);
  if (!!tableSelect) {
    if (
      !tableSelect.checkAcessGetDatabase(
        req.currentUser.manifestid,
        tableSelect.getTypeTable()
      )
    ) {
      return returnNotFound(res, { message: "Database inval" });
    }

    startPage = startPage * 1000;
    var itemSelect = tableSelect.getValueToSelectToFind(req.body.dataFind);
    var dataTableSQL = tableSelect.getSQLReport(req.currentUser);
    // console.log('cc', dataTableSQL)
    if (tableSelect.getFieldToDelete().valueSelect != "") {
      dataTableSQL =
        dataTableSQL +
        " WHERE " +
        tableSelect.getConditionManisfest(req.currentUser) +
        itemSelect;
    }
    dataTableSQL =
      dataTableSQL + " LIMIT " + startPage + "," + (startPage + 1000);
    console.log("dataTableSQL   ", dataTableSQL);
    knex.raw(dataTableSQL).then(
      (result) => {
        return returnOK(res, result[0]);
      },
      (error) => {
        return returnNotFound(res, error);
      }
    );
  } else return returnNotFound(res, { message: "Database inval x" });
};

userCtrl.getDairyChange = (req, res) => {
  var startPage = 0;
  if (!!req.body.startPage) startPage = req.body.startPage;
  var tableSelect = mangerModelAdmin(req.body.table);
  if (!!tableSelect) {
    if (
      !tableSelect.checkAcessGetDatabase(
        req.currentUser.manifestid,
        tableSelect.getTypeTable()
      )
    ) {
      return returnNotFound(res, { message: "Database inval" });
    }

    startPage = startPage * 1000;
    var itemSelect = tableSelect.getValueToSelectToFind(req.body.dataFind);
    var dataTableSQL = tableSelect.getSQLReport(req.currentUser);
    if (tableSelect.getFieldToDelete().valueSelect != "") {
      dataTableSQL =
        dataTableSQL +
        " WHERE " +
        tableSelect.getDairyChange(req.currentUser) +
        itemSelect;
    }
    dataTableSQL =
      dataTableSQL + " LIMIT " + startPage + "," + (startPage + 1000);
    console.log("dataTableSQL   ", dataTableSQL);
    knex.raw(dataTableSQL).then(
      (result) => {
        return returnOK(res, result[0]);
      },
      (error) => {
        return returnNotFound(res, error);
      }
    );
  } else return returnNotFound(res, { message: "Database inval x" });
};

userCtrl.getTableDataByGroup = function (req, res) {
  var table = req.body.table;
  var startPage = 0;
  if (!!req.body.startPage) startPage = req.body.startPage;
  var tableSelect = mangerModelAdmin(table);
  if (!!tableSelect) {
    if (
      !tableSelect.checkAcessGetDatabase(
        req.currentUser.manifestid,
        tableSelect.getTypeTable()
      )
    ) {
      return returnNotFound(res, { message: "Database inval" });
    }
    startPage = startPage * 1000;
    var dataTableSQL =
      tableSelect.getSQLReport(req.currentUser) +
      +" WHERE " +
      tableSelect.getConditionManisfest(req.currentUser) +
      tableSelect.getValueToSelectToFind(req.body.dataFind) +
      " LIMIT " +
      startPage +
      "," +
      (startPage + 1000);
    dataTableSQL +=
      " AND " +
      tableSelect.getNameTable() +
      ".groups_id = " +
      req.body.groups_id;
    console.log(dataTableSQL);
    knex.raw(dataTableSQL).then(
      (result) => {
        return returnOK(res, result[0]);
      },
      (error) => {
        return returnFalse(res, error);
      }
    );
  } else {
    return returnNotFound(res, { message: "Database inval" });
  }
};

userCtrl.getNumberPages = function (req, res) {
  var table = req.body.table;
  var tableSelect = mangerModelAdmin(table);
  if (!!tableSelect) {
    if (
      !tableSelect.checkAcessGetDatabase(
        req.currentUser.manifestid,
        tableSelect.getTypeTable()
      )
    ) {
      return returnNotFound(res, { message: "Database inval" });
    }
    var itemSelect =
      tableSelect.getConditionManisfest(req.currentUser) +
      tableSelect.getValueToSelectToFind(req.body.dataFind);
    var dataTableSQL =
      "SELECT COUNT(*) FROM " + tableSelect.getNameTable() + itemSelect;
    knex.raw(dataTableSQL).then(
      (result) => {
        return returnOK(res, result[0]);
      },
      (error) => {
        return returnFalse(res, error);
      }
    );
  } else {
    return returnNotFound(res, { message: "Database inval" });
  }
};

userCtrl.addDataToTable = async function (req, res) {
  var table = req.body.table;
  var tableSelect = mangerModelAdmin(table);
  if (!!tableSelect) {
    let data = req.body;
    console.log("checkInaval..........", req.currentUser);
    if (
      !tableSelect.checkDataAddDatabase(
        req.currentUser.manifestid,
        tableSelect.getTypeTable()
      )
    ) {
      return returnNotFound(res, { message: "Database inval" });
    }
    var checkInaval = await tableSelect.checkManifestSpecialTable(table, req);
    console.log("checkInaval", checkInaval);
    if (!checkInaval) {
      return returnNotFound(res, {
        message: "Tài khoản đã tồn tại hoặc chưa được cấp quyền cao hơn",
      });
    }
    // console.log("checkInaval", checkInaval);
    console.log("data=>>>>", data);
    var sqlData = await tableSelect.checkSqlAddAdmin(req, data);
    console.log(sqlData);
    knex.raw(sqlData).then(
      (result) => {
        return returnOK(res, result[0]);
      },
      (error) => {
        console.log(error);
        return returnFalse(res, error);
      }
    );
  } else {
    return returnNotFound(res, { message: "Database inval" });
  }
};

userCtrl.deleteData = async function (req, res) {
  console.log(req.body.table);
  var tableSelect = mangerModelAdmin(req.body.table);
  if (!!!tableSelect) {
    console.log("Khong thayyyy");
    return returnNotFound(res, { message: "Database inval" });
  }
  if (
    !tableSelect.checkDataDeleteDatabase(
      req.currentUser.manifestid,
      tableSelect.getTypeTable()
    )
  ) {
    return returnFalse(res, { message: "Database not access lv1" });
  }
  if (!(await tableSelect.checkDataToEdit(req))) {
    return returnFalse(res, { message: "Database not access lv2" });
  }
  let data = req.body;
  let dataUser = tableSelect.getFieldToDelete();
  var deleteSQL = squel
    .update()
    .table(tableSelect.getNameTable())
    .set("id_updated", req.currentUser.users_id)
    .set("updated_at", "NOW()", { dontQuote: true })
    .set("delete_flag", 1)
    .where(dataUser.locationSelect + "=" + data[dataUser.locationSelect]);
  knex
    .raw(deleteSQL.toString())
    .then(function (x) {
      return returnOK(res, x);
    })
    .catch(function (err) {
      console.log("Loiiii");
      return returnNotFound(res, { message: "Database inval" });
    });
};

userCtrl.updateData = async function (req, res) {
  var tableSelect = mangerModelAdmin(req.body.table);
  console.log("req.body.table....", req.body);
  if (!!!tableSelect) {
    return returnNotFound(res, { message: "Database inval" });
  }
  if (
    !tableSelect.checkDataEditDatabase(
      req.currentUser.manifestid,
      tableSelect.getTypeTable()
    )
  ) {
    return returnNotFound(res, { message: "Database not Acess 1" });
  }
  if (!(await tableSelect.checkDataToEdit(req))) {
    return returnNotFound(res, { message: "Database not Acess 2" });
  }

  let data = req.body;
  var userid = req.currentUser.user_id;
  let dataUser = tableSelect.getFieldToDelete();
  var squelGet = squel.select().from(tableSelect.getNameTable());
  console.log("data", data);
  for (var i = 0; i < dataUser.arrayCoppy.length; i++) {
    let item = dataUser.arrayCoppy[i];
    /*    if(!!!data[item]) squelGet.set(item,null);
       else
        authen.set(item,data[item]);
     */
    squelGet.field(item);
  }
  let dataUserFake = [...dataUser.arrayCoppy];
  if (data.table === "customer" || data.table === "user") {
    squelGet.field("password");
    dataUserFake = [...dataUserFake, "password"];
  }
  dataUserFake = [...dataUserFake, "id_updated"];
  squelGet.field("id_updated");
  squelGet.where(dataUser.locationSelect + "=" + data[dataUser.locationSelect]);

  var authen = squel
    .insert()
    .into(tableSelect.getNameTable())
    .fromQuery(dataUserFake, squelGet);
  console.log("updateDataauthen.toString() ", authen.toString());
  var dataAdd = await knex.raw(authen.toString());
  if (dataAdd == null || dataAdd.length < 1)
    return returnNotFound(res, "Không tồn tại bản ghi dữ liệu này");
  var authen2 = squel.update().table(tableSelect.getNameTable());
  authen2
    .where(dataUser.locationSelect + "=" + dataAdd[0].insertId)
    .set(dataUser.valueSelect, 1)
    .set("id_updated", userid)
    .set("old_id", data[dataUser.locationSelect])
    .set("delete_flag", 1)
    .set("updated_at", "NOW()", { dontQuote: true });
  console.log("oauthen2");
  console.log(authen2.toString());
  var deleteAdd = await knex.raw(authen2.toString());
  if (deleteAdd == null || deleteAdd.length < 1)
    return returnFalse(res, "Lỗi cập nhật dữ liệu");
  var sqlData = await tableSelect.checkSqlUpdateAdmin(req, data);
  knex
    .raw(sqlData)
    .then(function (x) {
      return returnOK(res, x);
    })
    .catch(function (err) {
      return returnFalse(res, err);
    });
};

userCtrl.updateUser = async (req, res) => {
  var tableSelect = mangerModelAdmin(req.body.table);
  if (!!!tableSelect) {
    return returnNotFound(res, { message: "Database inval" });
  }
  if (
    !tableSelect.checkDataEditDatabase(
      req.currentUser.manifestid,
      tableSelect.getTypeTable()
    )
  ) {
    return returnNotFound(res, { message: "Database not Acess 1" });
  }

  let data = req.body;
  var userid = req.currentUser.users_id;
  let dataUser = tableSelect.getFieldToDelete();
  var squelGet = squel.select().from(tableSelect.getNameTable());
  for (var i = 0; i < dataUser.arrayCoppy.length; i++) {
    let item = dataUser.arrayCoppy[i];
    /*    if(!!!data[item]) squelGet.set(item,null);
       else
        authen.set(item,data[item]);
     */
    squelGet.field(item);
  }
  squelGet.where(dataUser.locationSelect + "=" + data[dataUser.locationSelect]);
  var authen = squel
    .insert()
    .into(tableSelect.getNameTable())
    .fromQuery(dataUser.arrayCoppy, squelGet);
  console.log("updateDataauthen.toString() ", authen.toString());
  var dataAdd = await knex.raw(authen.toString());
  if (dataAdd == null || dataAdd.length < 1)
    return returnNotFound(res, "Không tồn tại bản ghi dữ liệu này");
  var authen2 = squel.update().table(tableSelect.getNameTable());
  authen2
    .where(dataUser.locationSelect + "=" + dataAdd[0].insertId)
    .set(dataUser.valueSelect, 1)
    .set("id_updated", userid)
    .set("old_id", data[dataUser.locationSelect])
    .set("delete_flag", 1)
    .set("updated_at", "NOW()", { dontQuote: true });
  console.log("oauthen2");
  console.log(authen2.toString());
  var deleteAdd = await knex.raw(authen2.toString());
  if (deleteAdd == null || deleteAdd.length < 1)
    return returnFalse(res, "Lỗi cập nhật dữ liệu");
  var authen3 = squel.update().table(tableSelect.getNameTable());
  authen3
    .where(dataUser.locationSelect + "=" + userid)
    .set("name", data.name)
    .set("fullname", data.fullname)
    .set("phoneNumber", data.phone)
    .set("contact", data.contact)
    .set("avatar", data.avatar)
    .set("old_id", 0)
    .set("delete_flag", 0)
    .set("updated_at", "NOW()", { dontQuote: true });
  console.log("updateDataauthen.toString() ", authen3.toString());
  knex
    .raw(authen3.toString())
    .then(function (x) {
      return returnOK(res, "Cập nhật dữ liệu thành công");
    })
    .catch(function (err) {
      return returnFalse(res, err);
    });
};

userCtrl.updateFistPages = async function (req, res) {
  var tableSelect = mangerModelAdmin("content_page");
  if (
    !tableSelect.checkDataEditDatabase(
      req.currentUser.manifestid,
      tableSelect.getTypeTable()
    )
  ) {
    return returnNotFound(res, { message: "Database inval" });
  }
  var sqlUpdate =
    "UPDATE content_page SET set_to_fist = ( SELECT MAX(set_to_fist) + 1 ) WHERE delete_flag =0 and content_page_id=" +
    req.body["content_page_id"] +
    ";";
  knex
    .raw(sqlUpdate)
    .then(function (x) {
      return returnOK(res, x);
    })
    .catch(function (err) {
      return returnNotFound(res, err);
    });
};

userCtrl.updateFistCourse = async function (req, res) {
  var tableSelect = mangerModelAdmin("course_page");
  if (
    !tableSelect.checkDataEditDatabase(
      req.currentUser.manifestid,
      tableSelect.getTypeTable()
    )
  ) {
    return returnNotFound(res, { message: "Database inval" });
  }
  var sqlUpdate =
    "UPDATE course_page SET set_to_fist = ( SELECT MAX(set_to_fist) + 1 ) WHERE delete_flag =0 and course_page_id=" +
    req.body["course_page_id"] +
    ";";
  knex
    .raw(sqlUpdate)
    .then(function (x) {
      return returnOK(res, x);
    })
    .catch(function (err) {
      return returnNotFound(res, err);
    });
};

// userCtrl.registerUser = async function (req, res) {
//   var table = "user";
//   // var tableSelect = mangerModelAdmin(table);
//   // var existingUser = await tableSelect.checkInvalUserExistingToRegister(
//   //   req.body
//   // );

//   var existingUser = await user.checkExistingUser( req.body );

//   if (existingUser) {
//     console.log(existingUser);
//     res.status(HttpStatus.UNAUTHORIZED).json({
//       success: false,
//       message: "Email or Phone number existed!",
//     });
//   }
//   else {
//     var newUser = squel
//     .insert()
//     .into("user")
//     .set("username", req.body.userName)
//     .set("fullname", req.body.fullName)
//     .set("email", req.body.email)
//     .set("password", req.body.password)
//     .set("phone_number", req.body.phoneNumber)
//     .set("address", req.body.address)
//     .set("avatar", req.body.avatar)
//     .set("created_at", "NOW()", { dontQuote: true })
//     .set("updated_at", "NOW()", { dontQuote: true })
//     .set("id_created", 0)
//     .set("id_updated", 0)
//     // .set("note", "")
//     .set("permission_id", 4)
//     .set("delete_flag", "0")
//     .set("old_id", "0");
//   // console.log(newUser.toString());
//   knex
//     .raw(newUser.toString())
//     .then((result) => {
//       // return returnOK(res, { result: "Please waitting admin comfirm" });
//       return res.json('User registered successfully!');
//     })
//     .catch((error) => {
//       console.log("error");
//       // console.log(error);
//       return returnFalse(res, error);
//     });
//   };
// };

//register new user
userCtrl.registerUser = async function (req, res) {
  const username = req.body.userName ? req.body.userName : null;
  const fullname = req.body.fullName ? req.body.fullName : null;
  const phone_number = req.body.phoneNumber ? req.body.phoneNumber : null;
  const email = req.body.email ? req.body.email : null;
  const password = req.body.password ? req.body.password : null;
  const address = req.body.address ? req.body.address : null;
  // const contact = req.body.contact ? req.body.contact : null;
  const permission_id = TableManifest.NEW_REGISTER;
  const created_at = new Date();
  const updated_at = new Date();
  const id_created = 0;
  const id_updated = 0;
  const delete_flag = 0;

  //hash password before save to database
  const salt = bcrypt.genSaltSync(12);
  const hashPass = await bcrypt.hash(password, salt);

  //save info to database
  await knex
    .raw(" SELECT * FROM user WHERE email = ?", [email])
    .then(async (user) => {
      if (user[0].length > 0) {
        console.log(user[0]);
        return res.status(208).json({ message: "Email existed!" });
      } else {
        await knex("user")
          .insert({
            username,
            fullname,
            phone_number,
            email,
            password: hashPass,
            address,
            // contact,
            permission_id,
            created_at,
            updated_at,
            id_created,
            id_updated,
            delete_flag,
          })
          .then(() => {
            return res.status(200).json({ message: "Register succesfully!" });
          })
          .catch((err) => {
            console.log(err);
            return res
              .status(500)
              .json({ message: "An error occured, please try again!" });
          });
      }
    });
};

// userCtrl.resetPass = async function (req, res) {
//   const data = req.body
//   User.query({
//     where: { email: data.email },
//     select: ['userid', 'fullname', 'manifestid']
//   })
//     .fetch({ require: false })
//     .then(user => {
//       if (!user) {
//         res.status(HttpStatus.NOT_FOUND).json({ error: 'No such this email' })
//       } else {
//         const userid = user.get('userid')
//         const nameUser = user.get('fullname')
//         var transporter = nodemailer.createTransport({
//           // cofig mail server
//           host: 'smtp.gmail.com',
//           port: 465,
//           secure: true,
//           auth: {
//             user: 'testairsense@gmail.com', //Tài khoản gmail Airsense
//             pass: 'giang2001' //Mật khẩu  gmail Airsense
//           },
//           tls: {
//             // do not fail on invalid certs
//             rejectUnauthorized: false
//           }
//         })
//         let token = getRamdomData(90)
//         const port = process.env.APP_PORT || 3000
//         const host = process.env.APP_HOST || 'localhost'
//         let URLtogetLink =
//           'http://' +
//           host +
//           ':' +
//           port +
//           '/api/auth/resetPassword/' +
//           userid +
//           '/' +
//           token
//         console.log(URLtogetLink)
//         var content = ''
//         content += ''
//         // const router = express.Router();
//         // content= router.get('/giang', (req, res) => {
//         //   res.render('authen/sendEmailForgotPass');
//         // });
//         // thiết lập đối tượng, nội dung gửi email
//         var mainOptions = {
//           from: 'NQH-Test nodemailer',
//           to: req.body.email,
//           subject: 'Reset Password',
//           html: content //Nội dung html mình đã tạo trên kia
//         }

//         transporter.sendMail(mainOptions, function (err, info) {
//           if (err) {
//             console.log(err)
//             req.flash('mess', 'Lỗi gửi mail: ' + err) //Gửi thông báo đến người dùng
//             res.redirect('/')
//           } else {
//             console.log('Message sent: ' + info.response)
//             const current_id = userid
//             const manifestId = user.get('manifestid')
//             var authen2 = squel
//               .insert()
//               .into('oauthen2')
//               .set('manifestid', manifestid)
//               .set('userid', current_id)
//               .set('tocken', token)
//               .set('id_updated', current_id)
//               .set('id_created', current_id)
//               .set('delete_flag', 0)
//               .set('created_at', 'NOW()', { dontQuote: true })
//               .set('updated_at', 'NOW()', { dontQuote: true })
//               .set('delete_flag', 0)
//               .set('time_relase', 'NOW() + INTERVAL 1 DAY', { dontQuote: true })
//               .set('check_reset', 'reset')
//             console.log(authen2.toString())
//             knex
//               .raw(authen2.toString())
//               .then(function (x) {
//                 res.json({
//                   success: true,
//                   message: 'Gửi email thành công'
//                 })
//               })
//               .catch(function (err1) {
//                 res.status(HttpStatus.UNAUTHORIZED).json({
//                   success: false,
//                   message: 'Problem SQL.'
//                 })
//               })

//             res.redirect('/')
//           }
//         })
//       }
//     })
// }

userCtrl.newResetPassword = async function (req, res) {
  const data = req.body;
  var checkToken = `SELECT tocken from oauthen2 WHERE userid = ${data.userId} AND check_reset = 'reset' AND created_at > date_sub(now(), interval 10 minute)`;
  var result = await knex.raw(checkToken.toString());
  if (!result) {
    console.log("Quá thời gian quy định, xin yêu cầu gửi email lại");
  } else {
    const tokenDB = result[0][0].tocken;
    console.log(tokenDB);
    if (tokenDB == data.token) {
      var authen = squel.update().table("users");
      authen
        .where("usersid=" + data.userId)
        .set("password", data.password)
        .set("updated_at", "NOW()", { dontQuote: true });
      console.log("updateDataauthen.toString() ", authen.toString());
      knex
        .raw(authen.toString())
        .then(function (x) {
          return returnOK(res, "Cập nhật mật khẩu thành công");
        })
        .catch(function (err) {
          return returnFalse(res, err);
        });
    } else {
      console.log("Quá thời gian quy định, xin yêu cầu gửi email lại");
    }
  }
};

// code hust tech
userCtrl.changePassword1 = async function (req, res) {
  //var acount="SELECT * FROM users " +request.body;
  var authen = squel
    .select()
    .from("users")
    .where("email='" + data["email"] + "'")
    .where("forgot_pass_token='" + data["forgot_pass_token"] + "'")
    .where("delete_flag=0");
  var result = await knex.raw(authen.toString());
  if (result == null || result.length == 0) {
    return returnNotFound(res, { message: "acao Not exitting " });
  }
  result[0][0].currentUser = { users_id: 0 };
  result[0][0].table = "users";
  //mailBoxSupport.sendEmailNomal(result[0]["add_table"].email,"đổi mat khau thanh cong")
  updateData(result[0][0], res);
};

// code airsense

// userCtrl.changePassword = async (req, res) => {
//   var tableSelect = mangerModelAdmin(req.body.table)
//   if (!!!tableSelect) {
//     return returnNotFound(res, { message: 'Database inval' })
//   }
//   if (
//     !tableSelect.checkDataEditDatabase(
//       req.currentUser.manifestid,
//       tableSelect.getTypeTable()
//     )
//   ) {
//     return returnNotFound(res, { message: 'Database not Acess 1' })
//   }
//   let data = req.body
//   let dataUser = tableSelect.getFieldToDelete()
//   User.query({
//     where: { userid: data[dataUser.locationSelect] },
//     select: ['password']
//   })
//     .fetch({ require: false })
//     .then(user => {
//       if (!user) {
//         res.status(HttpStatus.NOT_FOUND).json({ error: 'No such user' })
//       } else {
//         const password = user.get('password')
//         if (password === data.oldPassword) {
//           var authen = squel.update().table(tableSelect.getNameTable())
//           authen
//             .where(
//               dataUser.locationSelect + '=' + data[dataUser.locationSelect]
//             )
//             .set('password', data.newPassword)
//             .set('updated_at', 'NOW()', { dontQuote: true })
//           console.log('updateDataauthen.toString() ', authen.toString())
//           knex
//             .raw(authen.toString())
//             .then(function (x) {
//               return returnOK(res, 'Thay đổi mật khẩu thành công')
//             })
//             .catch(function (err) {
//               return returnFalse(res, err)
//             })
//         }
//       }
//     })
// }

userCtrl.listUser = async (req, res) => {
  var table = "user";
  var tableSelect = mangerModelAdmin(table);
  var dataInfo = await tableSelect.queryDatabase(
    tableSelect.getAllInfoToChat()
  );
  if (dataInfo) {
    console.log(dataInfo);
    return returnOK(res, dataInfo);
  } else {
    return returnFalse(res, { message: "phone and email is existing" });
  }
};

userCtrl.listComment = async (req, res) => {
  var mySql = squel.select().from("content_page").where("delete_flag=0");
  var result = await knex.raw(mySql.toString());
  if (result == null || result.length == 0) {
    return returnNotFound(res, { message: "No article" });
  }
  console.log(result[0]);
  // fake data

  const result1 = {
    result: [
      {
        users_id: 1,
        username: "cuong",
        email: "cuong@gmail.com",
        phone: "123456789",
        avatar:
          "https://1.bp.blogspot.com/-n_bFzL9lPUU/Xp23H9Sk8yI/AAAAAAAAhyA/JYfvZhwguxc8vT_YS3w14Xi3YWf3hxqIQCLcBGAsYHQ/s1600/Hinh-Anh-Dep-Tren-Mang%2B%25282%2529.jpg",
        fullname: "123456789",
      },
      {
        users_id: 13,
        username: "cuong1",
        email: "luvancuong0105@gmail.com",
        phone: "0389992137",
        avatar:
          "https://imgt.taimienphi.vn/cf/images/li/2017/9/26/hinh-anh-vui-hai-huoc.jpg",
        fullname: "Lu van",
      },
      {
        users_id: 14,
        username: "levan cuong",
        email: "luvan1@gmail.com",
        phone: "0988891234",
        avatar:
          "https://i.pinimg.com/236x/be/81/a2/be81a2314054d5effd7ea90e8375fbfe.jpg",
        fullname: "anhban",
      },
    ],
  };
  res.json({
    data: result1,
  });
};

userCtrl.getListUser = (req, res) => {
  const getUserQuery = squel
    .select()
    .from("user")
    .field("user_id")
    .field("username")
    .field("fullname")
    .field("email");
  knex
    .raw(getUserQuery.toString())
    .then((data) => {
      const records = data[0].map((row) => {
        return {
          user_id: row.user_id,
          username: row.username,
          fullname: row.fullname,
          email: row.email,
        };
      });
      return res.json(records);
    })
    .catch((err) => {
      return res.send(JSON.stringify("can not get list "));
    });
};

//update user information
userCtrl.updateInfo = async (req, res) => {
  console.log("check req body", req.body);

  const updateData = {
    updated_at: new Date(),
  };
  const user_id = req.currentUser.user_id;
  const { fullname, username, address, phone_number } = req.body;

  if (fullname) {
    updateData.fullname = fullname;
  }

  if (username) {
    updateData.username = username;
  }
  if (address) {
    updateData.address = address;
  }
  if (phone_number) {
    updateData.phone_number = phone_number;
  }

  //check if user existed
  const checkUser = squel
    .select()
    .from("user")
    .where("user_id='" + user_id + "'")
    .where("delete_flag = 0");
  const existedUser = await knex.raw(checkUser.toString());

  if (!existedUser) {
    return res.status(208).json({ message: "User not existed!" });
  }

  //update customer info
  knex("user")
    .where({ user_id: user_id })
    .update(updateData)
    .then(async () => {
      const checkUser = squel
        .select()
        .from("user")
        .where("user_id='" + user_id + "'")
        .where("delete_flag = 0");
      const existedUser = await knex.raw(checkUser.toString());
      const user = {
        user_id: existedUser[0][0].user_id,
        fullname: existedUser[0][0].fullname,
        username: existedUser[0][0].username,
        email: existedUser[0][0].email,
        address: existedUser[0][0].address,
        phone_number: existedUser[0][0].phone_number,
      };
      console.log("check exist user", user);
      return res.status(200).json(user);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ message: "Update failed !", error });
    });
};

//change user password after login
userCtrl.changePassword = async (req, res) => {
  const user_id = req.currentUser.user_id;
  const { old_password, new_password } = req.body;

  // Check if user existed
  const checkUser = squel
    .select()
    .from("user")
    .where("user_id='" + user_id + "'")
    .where("delete_flag = 0");
  const existedUser = await knex.raw(checkUser.toString());

  if (!existedUser) {
    return res.status(208).json({ message: "user not existed!" });
  }

  //Change customer password
  const passwordMatch = await bcrypt.compare(
    old_password,
    existedUser[0][0].password
  );

  if (!passwordMatch) {
    console.log("invalid password");
    return res.status(401).json({ message: "Invalid password!" });
  }

  const hashPass = await bcrypt.hash(new_password, 12);

  // customer.password = hashPass;
  await knex("user")
    .where({ user_id: user_id })
    .update({ password: hashPass })
    .then(() => {
      return res.status(200).json({ message: "Password change successfully!" });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

module.exports = userCtrl;
