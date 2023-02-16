const TypeModel = require("../middlewareDatabase/TypeModel.js");
const CommonModel = require("../middlewareDatabase/CommonModel.js");
const CustomerAcess = require("../middlewareDatabase/CustomerAcess.js");
/**
 * User model.
 */
class Product extends CommonModel {
  get tableName() {
    return "product";
  }
  getNameTable() {
    return "product";
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
        "group_sub_id",
        "title",
        "sub_title",
        "description",
        "thumbnail",
        "origin_country",
        "store_id",
        "meta_data",
        "old_id"
      ],
    };
  }
  getFieldToDelete() {
    return {
      arrayCoppy: [
        "group_sub_id",
        "title",
        "sub_title",
        "description",
        "thumbnail",
        "origin_country",
        "store_id",
        "meta_data",
        "created_at",
        "created_id",
        "old_id"
      ],
      locationSelect: "product_id",
      valueSelect: "delete_flag",
      userUpdate: "id_updated",
    };
  }

  getSQLReport(currentUser) {
    console.log("getSQLReport...2....... ", currentUser.permission_id);
    return "SELECT product.*,store.store_name FROM product LEFT JOIN store on store.store_id=product.store_id ";
    // + defineManifest.checkManifestTableUser(currentUser.permission_id,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind() {
    return ["title", "sub_title", "description", "thumbnail", "origin_country"];
  }
}

module.exports = Product;
