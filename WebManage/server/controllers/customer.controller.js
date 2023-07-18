const bookshelf = require("../config/bookshelf.js");
const HttpStatus = require("http-status-codes");
const bcrypt = require("bcrypt");
const knex = require("../config/knex.js");
var squel = require("squel");
const TableManifest = require("../models/middlewareDatabase/TableManifest.js");
const { mangerModelUser } = require("../models/database/managerAll.model.js");
const {
  returnOK,
  returnFalse,
  returnNotFound,
  returnOKCustom,
} = require("../utils/returnResponse.js");
const { uploadFileS3 } = require("../models/S3UploadFile.js");
const DocumentFileAndFolder = require("../models/DocumentFileAndFolder.js");
var documentFileAndFolder = new DocumentFileAndFolder();
// const customer = require("../models/database/customer.model");
const oAuthen2Customer = require("../models/database/oAuthen2Customer.model.js");
const { CostExplorer } = require("aws-sdk");
const { exceptions, error } = require("winston");
const User = require("../models/database/user.model.js");
const Customer = require("../models/database/customer.model.js");
const WarningInfo = require("../utils/warningInfo.js");

var customerCtrl = {};

customerCtrl.importDataInfo = async function (req, res) {
  var url = await uploadFileS3(req.file.path, req.file.filename);

  if (url != null) {
    returnOKCustom(res, { url: url });
  } else returnNotFound(res, "Not upload file", WarningInfo.NOT_UPLOAD_FILE);
};

customerCtrl.importDataExcel = async function (req, res) {
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    error: true,
    data: { message: err.message },
  });
};

customerCtrl.importData = function (req, res) {
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    error: true,
    data: { message: err.message },
  });
};

customerCtrl.getTableData = function (req, res) {
  var startPage = 0;
  if (!!req.body.startPage) startPage = req.body.startPage;
  var tableSelect = mangerModelUser(req.body.table);
  if (!!tableSelect) {
    if (
      !tableSelect.checkCustomerAccess(
        req.currentUser.enterprise_id,
        req.currentUser.value_manifest,
        tableSelect.getTypeTable()
      )
    ) {
      return returnNotFound(res, { message: "No permission to access" });
    }

    startPage = startPage * 1000;
    var itemSelect = tableSelect.getValueToSelectToFind(req.body.dataFind);
    var dataTableSQL = tableSelect.getSQLCustomerReport(req.currentUser);
    knex.raw(dataTableSQL).then(
      (result) => {
        return returnOK(res, result[0]);
      },
      (error) => {
        return returnNotFound(res, error);
      }
    );
  } else return returnNotFound(res, { message: "Database invalid" });
};

customerCtrl.getTableDataByGroup = function (req, res) {
  var table = req.body.table;
  var startPage = 0;
  if (!!req.body.startPage) startPage = req.body.startPage;
  var tableSelect = mangerModelUser(table);
  if (!!tableSelect) {
    if (
      !tableSelect.checkAcessGetDatabase(
        req.currentUser.manifestid,
        tableSelect.getTypeTable()
      )
    ) {
      return returnNotFound(res, { message: "Database inval" });
    }
    var checkInaval = tableSelect.checkManifestSpecialCustomer("view");
    if (!checkInaval) {
      return returnNotFound(res, { message: "Database Not Acess 2" });
    }
    startPage = startPage * 1000;
    var dataTableSQL =
      tableSelect.getSQLReport(req.currentUser) +
      this.getValueToSelectToFind(req.body.dataFind) +
      " LIMIT " +
      startPage +
      "," +
      (startPage + 1000);
    dataTableSQL +=
      " AND " +
      tableSelect.getNameTable() +
      ".groups_id = " +
      req.body.groups_id;
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

customerCtrl.getNumberPages = function (req, res) {
  var table = req.body.table;
  var tableSelect = mangerModelUser(table);
  if (!!tableSelect) {
    if (
      !tableSelect.checkAcessGetDatabase(
        req.currentUser.manifestid,
        tableSelect.getTypeTable()
      )
    ) {
      return returnNotFound(res, { message: "Database inval" });
    }
    var checkInaval = tableSelect.checkManifestSpecialCustomer("view");
    if (!checkInaval) {
      return returnNotFound(res, { message: "Database Not Acess 2" });
    }
    var itemSelect = tableSelect.getValueToSelectToFind(req.body.dataFind);
    var dataTableSQL =
      "SELECT COUNT(*) FROM " +
      tableSelect.getNameTable() +
      " where delete_flag=0 " +
      itemSelect;
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

customerCtrl.addDataToTable = async function (req, res) {
  var table = req.body.table;
  var tableSelect = mangerModelUser(table);
  if (!!tableSelect) {
    let data = req.body;
    if (
      !tableSelect.checkDataAddDatabase(
        req.currentUser.manifestid,
        tableSelect.getTypeTable()
      )
    ) {
      return returnNotFound(res, { message: "Database inval" });
    }
    var checkInvalid = tableSelect.checkManifestSpecialCustomer("add");
    if (!checkInvalid) {
      return returnNotFound(res, { message: "Database Not Acess 2" });
    }
    var userid = req.currentUser.users_id;
    let dataUser = tableSelect.getFieldToAdd(); //  DataTableFieldAdd[table];
    var authen = squel.insert().into(tableSelect.getNameTable());
    for (var i = 0; i < dataUser.valueSetup.length; i++) {
      let item = dataUser.valueSetup[i];
      if (!!!data[item]) authen.set(item, null);
      else authen.set(item, data[item]);
    }
    authen
      .set("id_created", userid)
      .set("id_updated", userid)
      .set("created_at", "NOW()", { dontQuote: true })
      .set("updated_at", "NOW()", { dontQuote: true })
      .set("delete_flag", 0);
    knex.raw(authen.toString()).then(
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

customerCtrl.deleteData = async function (req, res) {
  const tableSelect = mangerModelUser(req.body.table);
  try {
    if (!!!tableSelect) {
      return returnNotFound(res, { message: "Database inval" });
    }
    let data = req.body;
    let dataUser = tableSelect.getFieldToDelete();
    var deleteSQL = squel
      .update()
      .table(tableSelect.getNameTable())
      .set("id_updated", req.currentUser.customer_id)
      .set("updated_at", "NOW()", { dontQuote: true })
      .set("delete_flag", 1)
      .where(dataUser.locationSelect + "=" + data[dataUser.locationSelect]);
    knex
      .raw(deleteSQL.toString())
      .then(function (x) {
        return returnOK(res, x);
      })
      .catch(function (err) {
        return returnNotFound(res, { message: "Database inval" });
      });
  } catch (error) {
    console.log(error);
  }
};

customerCtrl.updateData = async function (req, res) {
  var tableSelect = mangerModelUser(req.body.table);
  if (!!!tableSelect) {
    return returnNotFound(res, { message: "Database inval" });
  }
  var checkInaval = tableSelect.checkManifestSpecialCustomer("edit");
  if (!checkInaval) {
    return returnNotFound(res, { message: "Database Not Acess 2" });
  }
  if (
    !tableSelect.checkDataEditDatabase(
      req.currentUser.manifestid,
      tableSelect.getTypeTable()
    )
  ) {
    return returnNotFound(res, { message: "Database not Acess" });
  }
  if (!(await tableSelect.checkDataToEdit(req))) {
    return returnNotFound(res, { message: "Database not Acess" });
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
  knex
    .raw(authen.toString())
    .then(function (x) {
      var authen2 = squel.update().table(tableSelect.getNameTable());
      authen2
        .where(dataUser.locationSelect + "=" + x[0].insertId)
        .set(dataUser.valueSelect, 1)
        .set("id_updated", userid)
        .set("old_id", data[dataUser.locationSelect])
        .set("delete_flag", 1)
        .set("updated_at", "NOW()", { dontQuote: true });
      let dataUser1 = tableSelect.getFieldToAdd();
      knex
        .raw(authen2.toString())
        .then(function (x) {
          var authen1 = squel.update().table(tableSelect.getNameTable());
          for (var i = 0; i < dataUser1.valueSetup.length; i++) {
            let item = dataUser1.valueSetup[i];
            if (!!!data[item]) authen1.set(item, null);
            else authen1.set(item, data[item]);
          }
          //authen1.set("id_created",data[dataUser.userUpdate])
          // .set(dataUser.userUpdate,data[dataUser.userUpdate])
          authen1
            .set("id_updated", userid)
            .set("created_at", "NOW()", { dontQuote: true })
            .set("updated_at", "NOW()", { dontQuote: true })
            .set("delete_flag", 0)
            .where(
              dataUser.locationSelect + "=" + data[dataUser.locationSelect]
            );
          knex
            .raw(authen1.toString())
            .then(function (x) {
              return returnOK(res, x);
            })
            .catch(function (err) {
              return returnFalse(res, err);
            });
        })
        .catch(function (err) {
          return returnFalse(res, err);
        });
    })
    .catch(function (err) {
      return returnNotFound(res, err);
    });
};

// customerCtrl.registerUser = function (req, res) {
//   var table = "customer";
//   var tableSelect = mangerModelUser(table);
//   if (!!tableSelect) {
//     var tableSelect = mangerModelUser(table);
//     if (
//       !tableSelect.checkDataAddDatabase(
//         req.currentUser.manifestid,
//         tableSelect.getTypeTable()
//       )
//     ) {
//       return returnNotFound(res, { message: "Database inval" });
//     }
//     var checkInaval = tableSelect.checkManifestSpecialCustomer("edit");
//     if (!checkInaval) {
//       return returnNotFound(res, { message: "Database Not Acess 2" });
//     }
//     checkDatataBaseInval = true;
//     var userToget = squel
//       .select()
//       .from("customer")
//       .where(
//         squel
//           .expr()
//           .and("phone='" + req.body["phone"] + "'")
//           .or("email='" + req.body["email"] + "'")
//       )
//       .where("delete_flag=0");

//     knex.raw(userToget.toString()).then(
//       (result) => {
//         let data = req.body;
//         let dataUser = tableSelect.getFieldToAdd(); //  DataTableFieldAdd[table];
//         var authen = squel.insert().into(tableSelect.getNameTable());
//         for (var i = 0; i < dataUser.valueSetup.length; i++) {
//           let item = dataUser.valueSetup[i];
//           if (!!!data[item]) authen.set(item, null);
//           else authen.set(item, data[item]);
//         }
//         authen
//           .set("id_created", 0)
//           .set("id_updated", 0)
//           .set("created_at", "NOW()", { dontQuote: true })
//           .set("updated_at", "NOW()", { dontQuote: true })
//           .set("delete_flag", 0);
//         knex.raw(authen.toString()).then(
//           (result) => {
//             return returnOK(res, { result: "Please waitting admin comfirm" });
//           },
//           (error) => {
//             return returnFalse(res, error);
//           }
//         );
//       },
//       (error) => {
//         return returnFalse(res, { message: "phone and email is existing" });
//       }
//     );
//   }
// };

//register new customer
customerCtrl.registerCustomer = async function (req, res) {
  const username = req.body.userName ? req.body.userName : null;
  const fullname = req.body.fullName ? req.body.fullName : null;
  const phone_number = req.body.phoneNumber ? req.body.phoneNumber : null;
  const email = req.body.email ? req.body.email : null;
  const password = req.body.password ? req.body.password : null;
  const address = req.body.address ? req.body.address : null;
  const contact = req.body.contact ? req.body.contact : null;
  const created_at = new Date();
  const updated_at = new Date();
  const id_created = 0;
  const id_updated = 0;
  const delete_flag = 0;

  //hash password before save to database
  const salt = bcrypt.genSaltSync(12);
  const hashPass = await bcrypt.hash(password, salt);

  //check email and phone number existed?
  await knex
    .raw(" SELECT * FROM customer WHERE email = ?", [email])
    .then(async (customer) => {
      if (customer[0].length > 0) {
        return res.status(208).json({ message: "Email existed!" });
      } else {
        await knex("customer")
          .insert({
            username,
            fullname,
            phone_number,
            email,
            password: hashPass,
            address,
            contact,
            // permission_id,
            created_at,
            updated_at,
            id_created,
            id_updated,
            delete_flag,
          })
          .then((customer) => {
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

customerCtrl.resetPass = async function (req, res) {
  //var acount="SELECT * FROM users " +request.body;
  var authen = squel
    .select()
    .from("customer")
    .where("email='" + data["email"] + "'")
    .where("forgot_pass_token='" + data["forgot_pass_token"] + "'")
    .where("=0");
  var result = await knex.raw(authen.toString());
  if (result == null || result.length == 0) {
    return returnNotFound(res, { message: "acao Not exitting " });
  }
  ////mailBoxSupport.sendEmailNomal(result[0]["add_table"].email,"please comfirm email "+result[0]["add_table"].forgot_pass_token)
};

// customerCtrl.changePassword = async function (req, res) {
//   //var acount="SELECT * FROM users " +request.body;
//   var authen = squel
//     .select()
//     .from("customer")
//     .where("email='" + data["email"] + "'")
//     .where("forgot_pass_token='" + data["forgot_pass_token"] + "'")
//     .where("delete_flag=0");
//   var result = await knex.raw(authen.toString());
//   if (result == null || result.length == 0) {
//     return returnNotFound(res, { message: "acao Not exitting " });
//   }
//   result[0][0].currentUser = { users_id: 0 };
//   result[0][0].table = "customer";
//   //mailBoxSupport.sendEmailNomal(result[0]["add_table"].email,"đổi mat khau thanh cong")
//   updateData(result[0][0], res);
// };

customerCtrl.getAllAdvertisementContent = async function (req, res) {
  var sql =
    "SELECT content_sub_id,group_file,filesave,title,content,content_img FROM advertisement_content WHERE delete_flag =0 ORDER BY set_to_fist ,advertisement_id DESC LIMIT 10 ";
  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    return returnOK(res, x[0]);
    return x[0];
  }
  return returnOK(res, []);
};

customerCtrl.getAllInfoProduct = async function (req, res) {
  var sql = getAllInfoProductInList(req.query.type, 0, 3);

  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    return returnOK(res, x[0]);
  }
  return returnOK(res, []);
};

customerCtrl.getInfoProduct = async function (req, res) {
  var sql =
    "SELECT product_store.*,product.title,product.description,product.thumbnail FROM product_store LEFT JOIN product_variant on product_store.product_id=product.product_variant_id LEFT JOIN product on product_variant.product_id = product.product_id WHERE product_store.delete_flag =0  AND product.store=" +
    req.body["type"];
  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    return returnOK(res, x[0]);
  }
  return returnOK(res, []);
};

customerCtrl.getDetailProduct = async function (req, res) {
  var sql =
    "SELECT product_store.*,product_image.*,product.title,product.description,product.thumbnail,product_variant.* FROM product_image " +
    "LEFT JOIN product_variant on product_image.product_variant_id=product_variant.product_variant_id " +
    "LEFT JOIN product_store on product_image.product_variant_id=product_store.product_variant_id " +
    "LEFT JOIN product on product_variant.product_id=product.product_id WHERE product_image.delete_flag =0 " +
    "AND product_variant.product_id=" +
    req.query.type;
  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    return returnOK(res, x[0]);
  }
  return returnOK(res, []);
};
customerCtrl.getDetailProductPages = async function (req, res) {
  var product_pages =
    "select product_spec.*,product.product_id from product_spec " +
    "join product on product.product_id = product_spec.product_id " +
    "where product_spec.delete_flag=0 and product.product_id = " +
    req.query.type;
  var result = await knex.raw(product_pages);
  if (result == null || result.length == 0) {
    return returnNotFound(
      res,
      { message: "acao Not exitting " },
      WarningInfo.ACCOUNT_NOT_EXIST
    );
  }
  return returnOK(res, result[0]);
};
customerCtrl.getAllInfoServices = async function (req, res) {
  var sql =
    "SELECT * FROM service WHERE delete_flag =0 ORDER BY  service_id DESC LIMIT 10 ";
  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    return returnOK(res, x[0]);
    return x[0];
  }
  return returnOK(res, []);
};

customerCtrl.setTheBillData = async function (req, res) {
  try {
    let data = req.body;
    var authenCustomer = new oAuthen2Customer();
    var userid = 0;
    var dataTocken = authenCustomer.getTockenHeader(req);
    if (!dataTocken.newUser) {
      // create new User
      tableSelect = mangerModelUser("customer");
      let dataUser = tableSelect.getFieldToAdd(); //  DataTableFieldAdd[table];
      var addCustomer = squel.insert().into(tableSelect.getNameTable());
      for (var i = 0; i < dataUser.valueSetup.length; i++) {
        let item = dataUser.valueSetup[i];
        if (!!!data[item]) addCustomer.set(item, null);
        else addCustomer.set(item, data[item]);
      }
      addCustomer
        .set("id_created", 0)
        .set("id_updated", 0)
        .set("created_at", "NOW()", { dontQuote: true })
        .set("updated_at", "NOW()", { dontQuote: true })
        .set("delete_flag", 0);
      var customerSql = await knex.raw(addCustomer.toString());
      if (customerSql == null || customerSql.length == 0) {
        return returnNotFound(res, { message: "Not find Sql " });
      }
      userid = customerSql[0].insertId;
    } else {
      var infoCustumer = authenCustomer.checkUserInval(dataTocken.token);
      if (!infoCustumer) {
        return returnNotFound(res, { message: "acao Not exitting " });
      }
      userid = infoCustumer.customeid;
    }
    tableSelect = mangerModelUser("buyproduct");
    var sqlBuyproduct = tableSelect.buyProductSQL(userid, 0, data);
    var x = await knex.raw(sqlBuyproduct);
    if (customerSql == null || customerSql.length == 0) {
      return returnNotFound(res, { message: "Not find Sql " });
    }
    var sqlStringProduct =
      "INSERT INTO buyproductdetail (buyproduct_id,product_id,product_image, quantity, KM, created_at, updated_at, id_created, id_updated, delete_flag, old_id) VALUES ";
    var thefist = false;
    data.value.forEach((element) => {
      if (thefist) sqlStringProduct = sqlStringProduct + ",";
      var addCustomer =
        "(" +
        x[0].insertId +
        "," +
        element.product_id +
        "," +
        element.imageInfo.image_id +
        "," +
        element.number +
        ",0,NOW(),NOW()," +
        userid +
        "," +
        userid +
        ",0,0)";
      sqlStringProduct = sqlStringProduct + addCustomer;
      thefist = true;
    });
    var databuyProduct = await knex.raw(sqlStringProduct);
    if (databuyProduct != null && databuyProduct.length > 0) {
      return returnOK(res, x[0].insertId);
    }
  } catch (ie) {
    return returnNotFound(res, { message: ie.toString() });
  }
  return returnNotFound(res, { message: "Not find Sql " });
};

customerCtrl.getDetailTheBill = async function (req, res) {
  var sql =
    "SELECT buyproductdetail.*,product.name,product.detail,product_image.* FROM buyproductdetail LEFT JOIN product on buyproductdetail.product_id=product.product_id LEFT JOIN product_image on buyproductdetail.product_image=product_image.image_id WHERE buyproductdetail.delete_flag =0 AND buyproductdetail.buyproduct_id=" +
    req.body["bill"];
  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    return returnOK(res, x[0]);
  }
  return returnOK(res, []);
};

customerCtrl.getAllCourses = async function (req, res) {
  var sql = "SELECT ";
};

//sale
customerCtrl.getLstProduct = async function (req, res) {
  var sql =
    "SELECT product.* FROM product   WHERE delete_flag =0 AND product_id in (" +
    req.body["product_id"] +
    ")";
  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    return returnOK(res, x[0]);
  }
  return returnOK(res, []);
};
customerCtrl.getInfoProductStore = async function (req, res) {
  var sql = getAllInfoProductInList(
    req.body["product_group"],
    req.body["start"],
    req.body["end"]
  );
  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    return returnOK(res, x[0]);
  }
  return returnOK(res, []);
};
function getAllInfoProductInList(product_group, start, end) {
  var sql =
    "	SELECT product_store.*,product.group_sub_id,product.thumbnail,product.product_id,product.title,product_image.link_url" +
    "  FROM product " +
    "JOIN product_variant on product.product_id= product_variant.product_id " +
    "JOIN product_store on product_variant.product_variant_id=product_store.product_variant_id " +
    "JOIN product_image on product_variant.product_variant_id=product_image.product_variant_id " +
    "WHERE product.delete_flag = 0  " +
    "AND product.group_sub_id = " +
    product_group +
    " LIMIT " +
    start +
    "," +
    end +
    ";";
  return sql;
}

// customer information
customerCtrl.addCustomer = async (req, res) => {
  console.log(req.body);
  const username = req.body.username ? req.body.username : null;
  const fullname = req.body.fullname ? req.body.fullname : null;
  const phone_number = req.body.phone_number ? req.body.phone_number : null;
  const email = req.body.email ? req.body.email : null;
  const password = "123456";
  const address = req.body.address ? req.body.address : null;
  const contact = req.body.contact ? req.body.contact : null;
  const created_at = new Date();
  const updated_at = new Date();
  const id_created = req.currentUser.customer_id;
  const id_updated = req.currentUser.customer_id;
  const delete_flag = 0;
  const permission = req.body.permission ? req.body.permission : null;
  //hash password before save to database
  const salt = bcrypt.genSaltSync(12);
  const hashPass = await bcrypt.hash(password, salt);
  const manifest = permission.map((item) => {
    return {
      manifest_id: item.permission,
      value_id: item.contentSub ? item.contentSub : item.station
    }
  })
  console.log("manifest", manifest)
  // check email and phone number existed?
  const customerExist = await knex.raw(" SELECT * FROM customer WHERE email = ?", [email])
  if (customerExist[0].length > 0) {
    return res.status(208).json({ message: "Email existed!" });
  } else {
    try {
      const customer = await knex("customer")
        .insert({
          username,
          fullname,
          phone_number,
          email,
          password: hashPass,
          address,
          contact,
          created_at,
          updated_at,
          id_created,
          id_updated,
          delete_flag,
        })
      if (customer && customer[0]) {
        for (let i = 0; i < manifest.length; i++) {
          await knex("ref_manifest")
            .insert({
              customer_id: customer[0],
              value_id: station_id,
              manifest_id: manifest[i].manifest_id,
              value_id:manifest[i].value_id,
              created_at,
              updated_at,
              id_created,
              id_updated,
              delete_flag,
              old_id: 0
            })
        }
      }
    }
    catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Có lỗi xảy ra, vui lòng thử lại" });
    }
  };
};

customerCtrl.updateInfo = async (req, res) => {
  const customer_id = req.currentUser.customer_id;
  // const email = req.body.email;
  const fullname = req.body.fullname;
  const username = req.body.username;
  const address = req.body.address;
  const contact = req.body.contact;
  const phone_number = req.body.phone_number;
  // const is_updated = new Date();

  const checkCustomer = squel
    .select()
    .from("customer")
    .where("customer_id='" + customer_id + "'")
    .where("delete_flag = 0");
  const existedCustomer = await knex.raw(checkCustomer.toString());

  if (!existedCustomer) {
    return res.status(208).json({ message: "Customer not existed!" });
  }

  //update customer info
  await knex("customer")
    .where({ customer_id: customer_id })
    .update({
      fullname: fullname,
      username: username,
      address: address,
      contact: contact,
      phone_number: phone_number,
      updated_at: new Date(),
    })
    .then((customer) => {
      return res.status(200).json({
        message: "Update customer info successfully !",
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ message: "Update failed !", error });
    });
};

//change customer password after login
customerCtrl.changePassword = async (req, res) => {
  const { email, old_password, new_password } = req.body;

  //check old password if correct
  await Customer.query({ email: { email } }).then(() => {
    bcrypt.compare(old_password, Customer.get("password"), (result, error) => {
      if (error) {
        return res.status(500).json("Error occured");
      }
      if (!result) {
        return res.status(401).json("Invalid password");
      }
    });
  });

  const newPass = await bcrypt.hash(new_password, 12, (error, hash) => {
    if (error) {
      return res.status(500).json("Error occured");
    }
    knex("customer")
      .where({ email: { email } })
      .update({ password: hash })
      .then(() => {
        return res.status(200).json("Change password succesfully");
      })
      .catch((err) => {
        return res.json({ err });
      });
  });
  return newPass;
};

//dashboard
customerCtrl.getDataAverage = async (req, res) => {
  try {
    const sqlStringAve = squel
      .select()
      .from("data_average")
      .order("time", false)
      .limit(3)
      .toString();
    const sqlStringAQI = squel
      .select()
      .from("aqi_data")
      .order("time", false)
      .limit(3)
      .toString();
    //query vao database
    const dataAve = await knex.raw(sqlStringAve);
    const dataAQI = await knex.raw(sqlStringAQI);
    //gui ve cho nguoi dung
    res.status(200).json({ dataAverage: dataAve[0], dataAQI: dataAQI[0] });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

//blog
customerCtrl.postUpdatePageToDataBase = function (request, res) {
  console.log("request.body", request.body);
  let content_html = request.body["content_html"];
  let group = request.body["group_file"];
  let content_sub_id = request.body["content_sub_id"];

  // save file
  var link = documentFileAndFolder.createNewFile(content_html, "storeHtml");
  if (link == null) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: true,
      data: { message: err.message },
    });
  } else {
    var addData = squel.update().table("content_page");
    // save data Sql
    addData
      .set("content_sub_id", content_sub_id)
      .set("group_file", group)
      .set("file_save", link)
      .set("title", request.body["title"])
      .set("description", request.body["description"])
      .set("set_to_first", request.body["set_to_first"])
      .set("content_img", request.body["content_img"])
      .set("id_created", request.currentUser.customer_id)
      .set("id_updated", request.currentUser.customer_id)
      .set("updated_at", "NOW()", { dontQuote: true })
      .set("delete_flag", 0)
      .where("content_page_id=" + request.body["content_page_id"]);
    knex
      .raw(addData.toString())
      .then(function (data) {
        return res.status(HttpStatus.OK).json({
          data,
        });
      })
      .catch(function (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: true,
          detail: err,
          data: "Database invalid",
        });
      });
  }
};
module.exports = customerCtrl;
