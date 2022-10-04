const TypeModel = require("../middlewareDatabase/TypeModel.js");
const TableView = require("../middlewareDatabase/TableView.js");
const TableManifest = require("../middlewareDatabase/TableManifest.js");
const TABLE_NAME = "course_page";
const CommonModel = require("../middlewareDatabase/CommonModel.js");
const defineManifest = require("../../middlewares/CheckManifest.js");
const CustomerAcess = require("../middlewareDatabase/CustomerAcess.js");
/**
 * User model.
 */
class PagesCourse extends CommonModel {
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
        "course_id",
        "group_file",
        "filesave",
        "title",
        "content",
        "content_img",
        "is_main_pages_id",
        "set_to_fist",
      ],
    };
  }
  getFieldToDelete() {
    return {
      arrayCoppy: [
        "course_id",
        "group_file",
        "filesave",
        "title",
        "content",
        "content_img",
        "is_main_pages_id",
        "set_to_fist",
        "created_at",
        "id_created",
      ],
      locationSelect: "course_page_id",
      valueSelect: "deleteflag",
      userUpdate: "id_updated",
    };
  }

  getSQLReport(currentUser) {
    return "SELECT course_page.* FROM course_page";
    //   + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind() {
    return ["course_id", "is_main_pages_id"];
  }
}

module.exports = PagesCourse;
