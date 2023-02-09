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

var customerCtrl = {};

customerCtrl.importDataInfo = async function (req, res) {
  console.log("importDataInfo", req.file);
  var url = await uploadFileS3(req.file.path, req.file.filename);
  console.log("importDataInfo s ==>", url);
  if (url != null) returnOKCustom(res, { url: url });
  else returnNotFound(res, "Not upload file", WarningInfo.NOT_UPLOAD_FILE);
};

customerCtrl.importDataExel = async function (req, res) {
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
  console.log(req.body);
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
    // var checkInaval = tableSelect.checkManifestSpecialCustomer("view");
    // if (!checkInaval) {
    //   return returnNotFound(res, { message: "Database Not Acess 2" });
    // }

    startPage = startPage * 1000;
    var itemSelect = tableSelect.getValueToSelectToFind(req.body.dataFind);
    var dataTableSQL = tableSelect.getSQLCustomer(req.currentUser);
    knex.raw(dataTableSQL).then(
      (result) => {
        return returnOK(res, result[0]);
      },
      (error) => {
        return returnNotFound(res, error);
      }
    );
  } else return returnNotFound(res, { message: "Database inval" });
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
    var checkInaval = tableSelect.checkManifestSpecialCustomer("add");
    if (!checkInaval) {
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
  var tableSelect = mangerModelUser(req.body.table);
  if (!!!tableSelect) {
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
  var checkInaval = tableSelect.checkManifestSpecialCustomer("edit");
  if (!checkInaval) {
    return returnNotFound(res, { message: "Database Not Acess 2" });
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
      return returnNotFound(res, { message: "Database inval" });
    });
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
  console.log("updateDataauthen.toString() ", authen.toString());
  knex
    .raw(authen.toString())
    .then(function (x) {
      var authen2 = squel.update().table(tableSelect.getNameTable());
      authen2
        .where(dataUser.locationSelect + "=" + x[0].insertId)
        .set(dataUser.valueSelect, 1)
        .set("id_updated", userid)
        .set("oldid", data[dataUser.locationSelect])
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

customerCtrl.registerUser = function (req, res) {
  var table = "customer";
  var tableSelect = mangerModelUser(table);
  if (!!tableSelect) {
    var tableSelect = mangerModelUser(table);
    if (
      !tableSelect.checkDataAddDatabase(
        req.currentUser.manifestid,
        tableSelect.getTypeTable()
      )
    ) {
      return returnNotFound(res, { message: "Database inval" });
    }
    var checkInaval = tableSelect.checkManifestSpecialCustomer("edit");
    if (!checkInaval) {
      return returnNotFound(res, { message: "Database Not Acess 2" });
    }
    checkDatataBaseInval = true;
    var userToget = squel
      .select()
      .from("customer")
      .where(
        squel
          .expr()
          .and("phone='" + req.body["phone"] + "'")
          .or("email='" + req.body["email"] + "'")
      )
      .where("delete_flag=0");

    knex.raw(userToget.toString()).then(
      (result) => {
        let data = req.body;
        let dataUser = tableSelect.getFieldToAdd(); //  DataTableFieldAdd[table];
        var authen = squel.insert().into(tableSelect.getNameTable());
        for (var i = 0; i < dataUser.valueSetup.length; i++) {
          let item = dataUser.valueSetup[i];
          if (!!!data[item]) authen.set(item, null);
          else authen.set(item, data[item]);
        }
        authen
          .set("id_created", 0)
          .set("id_updated", 0)
          .set("created_at", "NOW()", { dontQuote: true })
          .set("updated_at", "NOW()", { dontQuote: true })
          .set("delete_flag", 0);
        knex.raw(authen.toString()).then(
          (result) => {
            return returnOK(res, { result: "Please waitting admin comfirm" });
          },
          (error) => {
            return returnFalse(res, error);
          }
        );
      },
      (error) => {
        return returnFalse(res, { message: "phone and email is existing" });
      }
    );
  }
};

customerCtrl.resetPass = async function (req, res) {
  //var acount="SELECT * FROM users " +request.body;
  var authen = squel
    .select()
    .from("customer")
    .where("email='" + data["email"] + "'")
    .where("forgot_pass_token='" + data["forgot_pass_token"] + "'")
    .where("delete_flag=0");
  var result = await knex.raw(authen.toString());
  if (result == null || result.length == 0) {
    return returnNotFound(res, { message: "acao Not exitting " });
  }
  ////mailBoxSupport.sendEmailNomal(result[0]["add_table"].email,"please comfirm email "+result[0]["add_table"].forgot_pass_token)
};

customerCtrl.changePassword = async function (req, res) {
  //var acount="SELECT * FROM users " +request.body;
  var authen = squel
    .select()
    .from("customer")
    .where("email='" + data["email"] + "'")
    .where("forgot_pass_token='" + data["forgot_pass_token"] + "'")
    .where("delete_flag=0");
  var result = await knex.raw(authen.toString());
  if (result == null || result.length == 0) {
    return returnNotFound(res, { message: "acao Not exitting " });
  }
  result[0][0].currentUser = { users_id: 0 };
  result[0][0].table = "customer";
  //mailBoxSupport.sendEmailNomal(result[0]["add_table"].email,"đổi mat khau thanh cong")
  updateData(result[0][0], res);
};

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
  console.log("req ...xxx....getDetailProduct...", req.query.type);
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
  // var product_pages = squel
  //   .select()
  //   .from("product_spec")
  //   .where("product_id=" + req.query.type)
  //   .where("deleteflag=0");
  // console.log("req.query.type ==", req.query.type);
  var product_pages =
    "select product_spec.*,product.product_id from product_spec " +
    "join product_variant on product_spec.product_variant_id = product_variant.product_variant_id " +
    "join product on product_variant.product_id = product.product_id " +
    "where product_spec.delete_flag=0 and product.product_id = " +
    req.query.type;
  var result = await knex.raw(product_pages);
  if (result == null || result.length == 0) {
    return returnNotFound(
      res,
      { message: "acao Not exitting " },
      WarningInfo.DATA_NOT_EXSITING
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

const oAuthen2Customer = require("../models/database/oAuthen2Customer.model.js");

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
      "INSERT INTO buyproductdetail (buyproduct_id,product_id,product_image, quantity, KM, created_at, updated_at, id_created, id_updated, delete_flag, oldid) VALUES ";
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
    console.log("sqlStringProduct,,,,", sqlStringProduct);
    var databuyProduct = await knex.raw(sqlStringProduct);
    console.log("databuyProduct,, databuyProduct,,", databuyProduct);
    if (databuyProduct != null && databuyProduct.length > 0) {
      return returnOK(res, x[0].insertId);
    }
  } catch (ie) {
    return returnNotFound(res, { message: ie.toString() });
  }
  return returnNotFound(res, { message: "Not find Sql " });
};

customerCtrl.getDetailTheBill = async function (req, res) {
  console.log("req ...xxx....getDetailProduct...", req.body);
  var sql =
    "SELECT buyproductdetail.*,product.name,product.detail,product_image.* FROM buyproductdetail LEFT JOIN product on buyproductdetail.product_id=product.product_id LEFT JOIN product_image on buyproductdetail.product_image=product_image.image_id WHERE buyproductdetail.delete_flag =0 AND buyproductdetail.buyproduct_id=" +
    req.body["bill"];
  console.log("req ...xxx....getDetailProduct...sql", sql);
  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    return returnOK(res, x[0]);
  }
  return returnOK(res, []);
};

customerCtrl.getAllCourses = async function (req, res) {
  console.log("get all courses");
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

module.exports = customerCtrl;
