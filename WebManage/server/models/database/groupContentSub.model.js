const TypeModel = require("../middlewareDatabase/TypeModel.js");
const TableView = require("../middlewareDatabase/TableView.js");
const TableManifest = require("../middlewareDatabase/TableManifest.js");
const TABLE_NAME = "content_sub";
const CommonModel = require("../middlewareDatabase/CommonModel.js");
const defineManifest = require("../../middlewares/CheckManifest.js");
const CustomerAcess = require("../middlewareDatabase/CustomerAcess.js");
/**
 * User model.
 */
class GroupContentSub extends CommonModel {
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
      valueSetup: ["content", "content_group_id", "title"],
    };
  }
  getFieldToDelete() {
    return {
      arrayCoppy: [
        "content",
        "content_group_id",
        "title",
        "created_at",
        "id_created",
      ],
      locationSelect: "content_sub_id",
      valueSelect: "delete_flag",
      userUpdate: "id_updated",
    };
  }

  getSQLReport(currentUser) {
    console.log("getSQLReport...2....... ", currentUser.manifestid);
    return "SELECT content_sub.* ,content_group.content as group_content_main FROM content_sub LEFT JOIN content_group ON content_group.content_group_id=content_sub.content_group_id ";
    //   + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind() {
    return [];
  }
}

module.exports = GroupContentSub;
