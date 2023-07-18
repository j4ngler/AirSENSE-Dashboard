const TypeModel = require("../middlewareDatabase/TypeModel.js");

const TABLE_NAME = "home";
var squel = require("squel");
const knex = require("../../config/knex.js");
const CommonModel = require("../middlewareDatabase/CommonModel.js");

const { returnOKCustom, returnNotFound } = require("../../utils/returnResponse.js");
/**
 * User model.
 */
class Home extends CommonModel {
  /**
   * Get table name.
   */
  get tableName() {
    return TABLE_NAME;
  }


  get hasTimestamps() {
    return true;
  }
 

 
}


module.exports = User;
