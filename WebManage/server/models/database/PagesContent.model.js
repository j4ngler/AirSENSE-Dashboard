const TypeModel = require("../middlewareDatabase/TypeModel.js");
const TableView = require("../middlewareDatabase/TableView.js");
const TableManifest = require("../middlewareDatabase/TableManifest.js");
const TABLE_NAME = "content_page";
const CommonModel = require("../middlewareDatabase/CommonModel.js");
const defineManifest = require("../../middlewares/CheckManifest.js");
const CustomerAcess = require("../middlewareDatabase/CustomerAcess.js");
/**
 * User model.
 */
class PagesContent extends CommonModel {
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
  //	content_group_id	group_file	filesave	title	content	content_img
  getFieldToAdd() {
    return {
      valueSetup: [
        "content_sub_id",
        "group_file",
        "file_save",
        "title",
        "description",
        "content_img",
        "set_to_first",
      ],
    };
  }
  getFieldToDelete() {
    return {
      arrayCoppy: [
        "content_sub_id",
        "group_file",
        "file_save",
        "title",
        "description",
        "content_img",
        "set_to_first",
        "created_at",
        "id_created",
      ],
      locationSelect: "content_page_id",
      valueSelect: "delete_flag",
      userUpdate: "id_updated",
    };
  }

  getSQLReport(currentUser) {
    return "SELECT content_page.* FROM content_page ";
    //   + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }

  getSQLCustomerReport(currentUser) {
    return "SELECT content_page.*,content_sub.content_group_id,content_sub.title as content_sub_title,content_group.title as content_group_title " +
      "FROM content_page join content_sub on content_page.content_sub_id = content_sub.content_sub_id join content_group on content_sub.content_group_id = content_group.content_group_id "
      + "where content_page.delete_flag = 0 ";
    //   + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind() {
    return ["content_sub_id"];
  }
}

module.exports = PagesContent;
