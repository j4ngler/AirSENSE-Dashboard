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

          valueSetup: ["username","fullname","phone_number","email","address","avatar","permission" ]
      };
  }
  getFieldToDelete(){
      return {
          arrayCoppy:["username","fullname","phone_number","email","address","avatar","permisson_id","created_at","id_created"],
          locationSelect:"customer_id",
          valueSelect:"delete_flag",
          userUpdate:"id_updated"
      };
  }
  
  
  getSQLReport(currentUser){
    console.log("getSQLReport...2....... " ,currentUser.manifestid); 
      return ('SELECT customer.customer_id,customer.username,customer.email,customer.phone_number,customer.avatar,customer.fullname,customer.permission_id,customer.contact, customer.address'
      +',db.username  As name_create, dc.username  As name_update ,de.content As permission FROM customer LEFT JOIN user db ON db.user_id=customer.id_created LEFT JOIN user dc ON dc.user_id=customer.id_updated  LEFT JOIN permission de ON de.permission_id=customer.permission_id');
   //       + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }

  getConditionManisfest(info){
    return "customer.delete_flag=0 AND customer.permission_id>="+info.manifestid+ " ";
  }

  getDairyChange(info) {
    return "customer.delete_flag=1 AND customer.permission_id>="+info.manifestid+ " ";

  }

  getJsonTofind(){
      return [];
  }

  async checkValueEmailData(email){
    var squelGet=squel.select().from('customer').where('email="' + email +'"').where('delete_flag=0');
    var info= await knex.raw(squelGet.toString());
    if((info!=null)&&(info.length>0)) {
      return true;
    }
    return false;
  }

  async checkInvalUserExistingToRegister(request) {
      var checkInfo = squel.select().from("customer").where(
      squel.expr().and("phone_number='" + request["phone_number"] + "'").or("email='" + request["email"] + "'"));
      var info= await knex.raw(checkInfo.toString());
      if((info!=null)&&(info.length>0)) {
        return true;
      }
      return false;
  }

}

module.exports =  Customer;
