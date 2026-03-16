const TypeModel = require("../middlewareDatabase/TypeModel.js");
const TableView = require("../middlewareDatabase/TableView.js");
const TableManifest = require("../middlewareDatabase/TableManifest.js");
const TABLE_NAME = "content_group";
const CommonModel = require("../middlewareDatabase/CommonModel.js");
const defineManifest = require("../../middlewares/CheckManifest.js");
const CustomerAcess = require("../middlewareDatabase/CustomerAcess.js");
/**
 * User model.
 */
class GroupContent extends CommonModel {
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
  getNameTable() {
    return TABLE_NAME;
  }
  getTypeTable() {
    return TypeModel.NEWS;
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
      valueSetup: ["content_group", "title"],
    };
  }
  getFieldToDelete() {
    return {
      arrayCoppy: ["content_group", "title", "created_at", "id_created"],
      locationSelect: "content_group_id",
      valueSelect: "delete_flag",
      userUpdate: "id_updated",
    };
  }

  getSQLReport(currentUser) {
    console.log("getSQLReport...2....... ", currentUser.manifestid);
    return "SELECT content_group.* FROM content_group WHERE delete_flag = 0";
    //   + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }

  getSQLCustomerReport() {
    // console.log("getSQLReport...2....... ", currentUser.manifestid);
    return "SELECT content_group.* FROM content_group WHERE delete_flag = 0";
  }
  getJsonTofind() {
    return [];
  }
}

module.exports = GroupContent;
