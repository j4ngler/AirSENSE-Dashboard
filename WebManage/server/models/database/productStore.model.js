const TypeModel = require("../middlewareDatabase/TypeModel.js");
const CommonModel = require("../middlewareDatabase/CommonModel.js");
const CustomerAcess = require("../middlewareDatabase/CustomerAcess.js");
/**
 * User model.
 */
class ProductStore extends CommonModel {
  get tableName() {
    return "product_store";
  }
  getNameTable() {
    return "product_store";
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
        "store_id",
        "mid_cost",
        "final_cost",
        "promotion",
        "expiration_date",
      ],
    };
  }
  getFieldToDelete() {
    return {
      arrayCoppy: [
        "product_variant_id",
        "store_id",
        "mid_cost",
        "final_cost",
        "promotion",
        "expiration_date",
        "created_at",
        "id_created",
      ],
      locationSelect: "product_store_id",
      valueSelect: "delete_flag",
      userUpdate: "id_updated",
    };
  }

  getSQLReport(currentUser) {
    console.log("getSQLReport...2....... ", currentUser.permission_id);
    return "SELECT product_store.*,store.store_name,product_variant.title FROM product_store LEFT JOIN store on store.store_id=product_store.store_id LEFT JOIN product_variant on product_variant.product__variant_id=product_store.product_variant_id ";
    // + defineManifest.checkManifestTableUser(currentUser.permission_id,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind() {
    return ["mid_cost", "final_cost", "promotion"];
  }
}

module.exports = ProductStore;
