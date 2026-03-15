const TypeModel = require("../middlewareDatabase/TypeModel.js");
const CommonModel = require("../middlewareDatabase/CommonModel.js");
const CustomerAcess = require("../middlewareDatabase/CustomerAcess.js");
/**
 * User model.
 */
class ProductVariant extends CommonModel {
  get tableName() {
    return "product_variant";
  }
  getNameTable() {
    return "product_variant";
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
      valueSetup: ["product_id", "title", "meta_data", "rank","old_id"],
    };
  }
  getFieldToDelete() {
    return {
      arrayCoppy: [
        "product_id",
        "title",
        "meta_data",
        "rank",
        "created_at",
        "created_id",
        "old_id",
      ],
      locationSelect: "product_variant_id",
      valueSelect: "delete_flag",
      userUpdate: "id_updated",
    };
  }

  getSQLReport(currentUser) {
    console.log("getSQLReport...2....... ", currentUser.permission_id);
    return "SELECT product_variant.*,product.title FROM product_variant LEFT JOIN product on product_variant.product_id=product.product_id ";
    // + defineManifest.checkManifestTableUser(currentUser.permission_id,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind() {
    return ["product_id", "title", "meta_data", "rank"];
  }
}

module.exports = ProductVariant;
