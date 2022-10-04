const TypeModel = require("../middlewareDatabase/TypeModel.js");
const TableView = require("../middlewareDatabase/TableView.js");
const TableManifest = require("../middlewareDatabase/TableManifest.js");
const TABLE_NAME = "exam_detail";
const CommonModel = require("../middlewareDatabase/CommonModel.js");
const defineManifest = require("../../middlewares/CheckManifest.js");
const CustomerAcess = require("../middlewareDatabase/CustomerAcess.js");
/**
 * User model.
 */
class ExamDetail extends CommonModel {
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
        "exam_id",
        "group_file",
        "filesave",
        "title",
        "content",
        "content_img",
        "is_main_pages_id",
        "reply",
        "set_to_fist",
        "mark",
      ],
    };
  }
  getFieldToDelete() {
    return {
      arrayCoppy: [
        "exam_id",
        "group_file",
        "filesave",
        "title",
        "content",
        "content_img",
        "is_main_pages_id",
        "reply",
        "set_to_fist",
        "mark",
        "created_at",
        "id_created",
      ],
      locationSelect: "exam_detail_id",
      valueSelect: "deleteflag",
      userUpdate: "id_updated",
    };
  }

  getSQLReport(currentUser) {
    return "SELECT exam_detail.* FROM exam_detail";
    //   + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind() {
    return ["exam_id", "is_main_pages_id"];
  }
}

module.exports = ExamDetail;
