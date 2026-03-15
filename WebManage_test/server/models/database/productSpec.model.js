const TypeModel = require("../middlewareDatabase/TypeModel.js");
const CommonModel = require("../middlewareDatabase/CommonModel.js");
const CustomerAcess = require("../middlewareDatabase/CustomerAcess.js");
/**
 * User model.
 */
class ProductSpec extends CommonModel {
  get tableName() {
    return "product_spec";
  }
  getNameTable() {
    return "product_spec";
  }
  getTypeTable() {
    return TypeModel.SELL_PRODUCT;
  }
  customerAcess() {
    return {
      edit: CustomerAcess.ONLY_USER,
      add: CustomerAcess.ONLY_USER,
      view: CustomerAcess.ONLY_USER,
    };
  }
  getFieldToAdd() {
    return {
      valueSetup: [
        "product_variant_id",
        "filesave",
        "old_id"
      ],
    };
  }
  getFieldToDelete() {
    return {
      arrayCoppy: [
        "product_variant_id",
        "filesave",
        "created_at",
        "created_id",
        "old_id"
      ],
      locationSelect: "product_spec",
      valueSelect: "delete_flag",
      userUpdate: "id_updated",
    };
  }

  getSQLReport(currentUser) {
    console.log("getSQLReport...2....... ", currentUser.permission_id);
    return "SELECT * FROM product_spec ";
    // + defineManifest.checkManifestTableUser(currentUser.permission_id,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind() {
    return ["product_variant_id","filesave"];
  }
}
module.exports = ProductSpec;
