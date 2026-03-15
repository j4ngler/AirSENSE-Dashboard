const TypeModel = require("../middlewareDatabase/TypeModel.js");
const CommonModel = require("../middlewareDatabase/CommonModel.js");
const CustomerAcess = require("../middlewareDatabase/CustomerAcess.js");

class Store extends CommonModel {
  get tableName() {
    return "store";
  }
  getNameTable() {
    return "store";
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
        "store_name",
        "owner_id",
        "store_id",
        "type_owner_id",
        "address_id",
        "address_detail",
      ],
    };
  }
  getFieldToDelete() {
    return {
      arrayCoppy: [
        "store_name",
        "owner_id",
        "store_id",
        "type_owner_id",
        "address_id",
        "address_detail",
      ],
      locationSelect: "company_id",
      valueSelect: "deleteflag",
      userUpdate: "id_updated",
    };
  }

  getSQLReport(currentUser) {
    console.log("getSQLReport...2....... ", currentUser.permission_id);
    return "SELECT store.* FROM store ";
    // + defineManifest.checkManifestTableUser(currentUser.permission_id,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind() {
    return [
      "store_name",
      "owner_id",
      "store_id",
      "type_owner_id",
      "address_id",
      "address_detail",
    ];
  }
}

module.exports = Store;
