const TypeModel = require("../middlewareDatabase/TypeModel.js");

const TABLE_NAME = "ref_customer_home";
var squel = require("squel");
const knex = require("../../config/knex.js");
const CommonModel = require("../middlewareDatabase/CommonModel.js");

const { returnOKCustom, returnNotFound } = require("../../utils/returnResponse.js");
/**
 * User model.
 */
class Ref_customer_home extends CommonModel {
  /**
   * Get table name.
   */
  get TableName() {
    return TABLE_NAME;
  } 
}


module.exports = new Ref_customer_home;
