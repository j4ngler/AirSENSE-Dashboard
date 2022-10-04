const TypeModel= require('../middlewareDatabase/TypeModel.js');
const CustomerAcess= require('../middlewareDatabase/CustomerAcess.js');

const TableView= require('../middlewareDatabase/TableView.js');
const TableManifest= require('../middlewareDatabase/TableManifest.js');
const CommonModel= require('../middlewareDatabase/CommonModel.js');
const TABLE_NAME = 'address';
const  defineManifest  = require('../../middlewares/CheckManifest.js');




/**
 * User model.
 */
class Adress extends CommonModel {
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
  getNameTable(){ return TABLE_NAME;}
  getTypeTable(){ return TypeModel.SELL_PRODUCT;}

  customerAcess(){ 
    return  {edit:CustomerAcess.ONLY_USER,
             add:CustomerAcess.ONLY_USER,
             view:CustomerAcess.ONLY_USER  }; 
  }
  
  getFieldToAdd(){
      return {
          valueSetup: ["userid","name","contactPhoneNumber","province","city","streetaddr","postCode"]
      };
  }
  getFieldToDelete(){
      return {
          arrayCoppy:["userid","name","contactPhoneNumber","province","city","streetaddr","postCode","created_at","id_created"],
          locationSelect:"addrid",
          valueSelect:"deleteflag",
          userUpdate:"id_updated"
      };
  }
  
  
  getSQLReport(currentUser){
    console.log("getSQLReport...2....... " ,currentUser.manifestid); 
      return ('SELECT address.* FROM address ');
         // + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind(){
      return [];
  }

  
}

module.exports =  Adress;
