const TypeModel = require("../middlewareDatabase/TypeModel.js");
const TableView = require("../middlewareDatabase/TableView.js");
const TableManifest = require("../middlewareDatabase/TableManifest.js");
const TABLE_NAME = "sensor_device_type";
const CommonModel = require("../middlewareDatabase/CommonModel.js");
const defineManifest = require("../../middlewares/CheckManifest.js");
const CustomerAcess = require("../middlewareDatabase/CustomerAcess.js");
/**
 * User model.
 */
class sparcGroupLocationSensor extends CommonModel {
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
      valueSetup: ["content"],
    };
  }
  getFieldToDelete() {
    return {
      arrayCoppy: ["content"],
      locationSelect: "device_type_id",
      valueSelect: "delete_flag",
      userUpdate: "id_updated",
    };
  }

  getSQLReport(currentUser) {
    console.log("getSQLReport...2....... ", currentUser.manifestid);
    return "SELECT sensor_device_type.* FROM sensor_device_type ";
    //   + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind() {
    return [];
  }
}

module.exports = sparcGroupLocationSensor;
