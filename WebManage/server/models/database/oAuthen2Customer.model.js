const TypeModel = require("../middlewareDatabase/TypeModel.js");
const TableView = require("../middlewareDatabase/TableView.js");
const TABLE_NAME = "oauthen2_customer";
const TableManifest = require("../middlewareDatabase/TableManifest.js");
const knex = require("../../config/knex.js");
const CommonModel = require("../middlewareDatabase/CommonModel.js");
var squel = require("squel");
const defineManifest = require("../../middlewares/CheckManifest.js");
const HttpStatus = require("http-status-codes");
const CustomerAcess = require("../middlewareDatabase/CustomerAcess.js");
const { getRamdomData } = require("../../utils/utilsString.js");
const {
  returnOK,
  returnNotAuthen,
  returnOKCustom,
} = require("../../utils/returnResponse.js");

/**
 * Enterprise model.
 */
class oAuthen2Customer extends CommonModel {
  /**
   * Get table name.
   */
  get tableName() {
    return TABLE_NAME;
  }
  getTypeTable() {
    return TypeModel.SELL_PRODUCT;
  }
  customerAcess() {
    return {
      edit: CustomerAcess.NOT_ACESS,
      add: CustomerAcess.NOT_ACESS,
      view: CustomerAcess.NOT_ACESS,
    };
  }
  /**
   * Table has timestamps.
   */
  checkInvalUserExistingTocken(token) {
    var authen = squel
      .select()
      .from("oauthen2_customer")
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
          return reject(err);
        });
    });
  }

  async responseLogin(res, user) {
    const dataTocken = getRamdomData(256);
    var current_id = user.get("customer_id");
    const listDataRole = await this.getPermissionCustomer(current_id);
    let listDataContain = "";
    var authen2 = squel
      .insert()
      .into("oauthen2_customer")
      .set("customer_id", current_id)
      .set("token", dataTocken)
      .set("delete_flag", 0)
      .set("created_at", "NOW()", { dontQuote: true })
      .set("delete_flag", 0)
      .set("time_release", "NOW() + INTERVAL 1 DAY", { dontQuote: true });
    authen2.set("value_manifest", listDataContain);
    authen2.set("value_service", listDataRole);
    knex
      .raw(authen2.toString())
      .then(function (x) {
        // console.log(" knex err1 .....",x);
        return returnOKCustom(res, {
          success: true,
          token: dataTocken,
          email: user.get("email"),
        });
      })
      .catch(function (err1) {
        // console.log("err1 .....",err1);
        return returnNotAuthen(res, err1);
      });
  }

  get hasTimestamps() {
    return true;
  }
  getNameTable() {
    return TABLE_NAME;
  }

  getJsonTofind() {
    return [];
  }
  getFieldToAdd() {
    return {
      valueSetup: ["permission_id", "userid", "tocken", "value_manifest"],
    };
  }
  getFieldToDelete() {
    return {
      arrayCoppy: [
        "permission_id",
        "userid",
        "tocken",
        "value_manifest",
        "created_at",
        "id_created",
      ],
      locationSelect: "id",
      valueSelect: "deleteflag",
      userUpdate: "id_updated",
    };
  }

  getSQLReport(currentUser) {
    return "SELECT oauthen2_customer.* FROM oauthen2_customer ";
    // return 'SELECT oauthen2customer.*, db.username As namecreate ,dc.username As nameupdate ,dg.content as contentauthen,dn.username as userauthen FROM oauthen2 LEFT JOIN users db ON db.users_id=oauthen2.id_created LEFT JOIN users dc ON dc.users_id=oauthen2.id_updated LEFT JOIN permission dg ON dg.permission_id=oauthen2.permission_id LEFT JOIN users dn ON dn.users_id=oauthen2.userid';
  }

  getTockenHeader(req) {
    const authorizationHeader = req.headers["authorization"];
    let token;
    var newUser = true;
    if (authorizationHeader) {
      token = authorizationHeader.split(" ")[1];
      newUser = false;
    }
    return { newUser: newUser, token: token };
  }

  async checkUserInval(tocken) {
    var authen = squel
      .select()
      .from("oauthen2customer")
      .where("tocken = '" + tocken + "'")
      .where("delete_flag = 0")
      .where("time_relase > NOW()");
    var infoUser = knex.raw(authen.toString());
    if (infoUser != null && infoUser.length > 0) {
      return infoUser[0];
    }
    return false;
  }
}

module.exports = oAuthen2Customer;
