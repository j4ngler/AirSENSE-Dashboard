const TypeModel = require("../middlewareDatabase/TypeModel.js");
const TableView = require("../middlewareDatabase/TableView.js");
const TableManifest = require("../middlewareDatabase/TableManifest.js");
const TABLE_NAME = "user";
var squel = require("squel");
const knex = require("../../config/knex.js");
const CommonModel = require("../middlewareDatabase/CommonModel.js");
const defineManifest = require("../../middlewares/CheckManifest.js");
const CustomerAcess = require("../middlewareDatabase/CustomerAcess.js");
/**
 * User model.
 */
class User extends CommonModel {
  /**
   * Get table name.
   */
  get tableName() {
    return TABLE_NAME;
  }

  /**
   * Table has timestamps.
   */
  get hasTimestamps() {
    return true;
  }
  /*
  verifyPassword(password) {
    return this.get('password') === password;
  } */
  getNameTable = () => {
    return TABLE_NAME;
  };
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
  getFieldToAdd() {
    return {
      valueSetup: [
        "username",
        "password",
        "fullname",
        "phone_number",
        "email",
        "address",
        "avatar",
        "permission_id",
      ],
    };
  }
  getFieldToDelete() {
    return {
      arrayCoppy: [
        "username",
        "fullname",
        "phone_number",
        "email",
        "address",
        "avatar",
        "permission_id",
        "created_at",
        "id_created",
        "updated_at",
      ],
      locationSelect: "user_id",
      valueSelect: "delete_flag",
      userUpdate: "id_updated",
    };
  }

  getSQLReport(currentUser) {
    console.log("getSQLReport...2....... ", currentUser.manifestid);
    return (
      "SELECT user.user_id,user.username,user.email,user.phone_number,user.avatar,user.fullname,user.permission_id,user.address" +
      ",db.email  As name_create, dc.email  As name_update ,de.role As manifest_content FROM user LEFT JOIN user db ON db.user_id=user.id_created LEFT JOIN user dc ON dc.user_id=user.id_updated  LEFT JOIN permission de ON de.permission_id=user.permission_id"
    );
    //       + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }

  getConditionManisfest(info) {
    return (
      "user.delete_flag=0 AND user.permission_id>=" + info.manifestid + " "
    );
  }

  getDairyChange(info) {
    return (
      "user.delete_flag=1 AND user.permission_id>=" + info.manifestid + " "
    );
  }

  getJsonTofind() {
    return [];
  }

  getAllInfoToChat() {
    return "SELECT users.userid, users.name,users.email,users.phoneNumber,users.avartar,users.fullname FROM users where users.delete_flag=0 ";
    //       + defineManifest.checkManifestTableUser(currentUser.permission_id,currentUser.users_id,currentUser.value_manifest));
  }

  async checkValueEmailData(email) {
    var squelGet = squel
      .select()
      .from("users")
      .where('email="' + email + '"')
      .where("delete_flag=0");
    var info = await knex.raw(squelGet.toString());
    if (info != null && info.length > 0) {
      return true;
    }
    return false;
  }

  async checkInvalUserExistingToRegister(request) {
    var checkInfo = squel
      .select()
      .from("users")
      .where(
        squel
          .expr()
          .and("phoneNumber='" + request["phoneNumber"] + "'")
          .or("email='" + request["email"] + "'")
      );
    var info = await knex.raw(checkInfo.toString());
    if (info != null && info.length > 0) {
      return true;
    }
    return false;
  }
}

module.exports = User;
