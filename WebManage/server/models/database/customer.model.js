const TypeModel= require('../middlewareDatabase/TypeModel.js');
const TableView= require('../middlewareDatabase/TableView.js');
const TableManifest= require('../middlewareDatabase/TableManifest.js');
const TABLE_NAME = 'customer';
var squel = require("squel");
const knex = require('../../config/knex.js');
const CommonModel= require('../middlewareDatabase/CommonModel.js');
const  defineManifest  = require('../../middlewares/CheckManifest.js');
const CustomerAcess= require('../middlewareDatabase/CustomerAcess.js');
/**
 * User model.
 */
class Customer extends CommonModel {
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
  getNameTable=()=>{ return TABLE_NAME;}
  getTypeTable(){ return TypeModel.SELL_PRODUCT;}
  customerAcess(){ 
    return  {edit:CustomerAcess.NOT_ACESS,
             add:CustomerAcess.NOT_ACESS,
             view:CustomerAcess.NOT_ACESS  }; 
  }
  getFieldToAdd(){
      return {

          valueSetup: ["name","fullname","phoneNumber","email","contact","addrid","avartar","note","manifestid" ]
      };
  }
  getFieldToDelete(){
      return {
          arrayCoppy:["name","fullname","phoneNumber","email","contact","addrid","avartar","note","manifestid","created_at","id_created"],
          locationSelect:"userid",
          valueSelect:"deleteflag",
          userUpdate:"id_updated"
      };
  }
  
  
  getSQLReport(currentUser){
    console.log("getSQLReport...2....... " ,currentUser.manifestid); 
      return ('SELECT users.userid,users.name,users.email,users.phoneNumber,users.avartar,users.fullname,users.manifestid,users.contact,users.note'
      +',db.email  As name_create, dc.email  As name_update ,de.content As manifest_content FROM users LEFT JOIN users db ON db.userid=users.id_created LEFT JOIN users dc ON dc.userid=users.id_updated  LEFT JOIN manifest_authen de ON de.manifestid=users.manifestid');
   //       + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }

  getConditionManisfest(info){
    return "users.deleteflag=0 AND users.manifestid>="+info.manifestid+ " ";
  }

  getDairyChange(info) {
    return "users.deleteflag=1 AND users.manifestid>="+info.manifestid+ " ";

  }

  getJsonTofind(){
      return [];
  }

  async checkValueEmailData(email){
    var squelGet=squel.select().from('users').where('email="' + email +'"').where('deleteflag=0');
    var info= await knex.raw(squelGet.toString());
    if((info!=null)&&(info.length>0)) {
      return true;
    }
    return false;
  }

  async checkInvalUserExistingToRegister(request) {
      var checkInfo = squel.select().from("users").where(
      squel.expr().and("phoneNumber='" + request["phoneNumber"] + "'").or("email='" + request["email"] + "'"));
      var info= await knex.raw(checkInfo.toString());
      if((info!=null)&&(info.length>0)) {
        return true;
      }
      return false;
  }

}

module.exports =  Customer;
