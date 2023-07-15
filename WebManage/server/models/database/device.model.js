const TypeModel = require("../middlewareDatabase/TypeModel.js");

const TABLE_NAME = "device";
var squel = require("squel");
const knex = require("../../config/knex.js");
const CommonModel = require("../middlewareDatabase/CommonModel.js");

const { returnOKCustom, returnNotFound } = require("../../utils/returnResponse.js");
class Device  extends CommonModel {
  /**
   * Get table name.
   */
  get tableName() {
    return TABLE_NAME;
  }

 

 
}


module.exports = User;
