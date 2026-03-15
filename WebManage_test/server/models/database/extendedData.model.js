const TypeModel= require('../middlewareDatabase/TypeModel.js');
const TableView= require('../middlewareDatabase/TableView.js');
const TableManifest= require('../middlewareDatabase/TableManifest.js');
const TABLE_NAME = 'extended_data';
const CommonModel= require('../middlewareDatabase/CommonModel.js');
const  defineManifest  = require('../../middlewares/CheckManifest.js');
const CustomerAcess= require('../middlewareDatabase/CustomerAcess.js');
/**
 * User model.
 */
class ExtendedData extends CommonModel {
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
  getTypeTable(){ return TypeModel.NEWS;}
  customerAcess(){ 
    return  {edit:CustomerAcess.NOT_ACESS,
             add:CustomerAcess.NOT_ACESS,
             view:CustomerAcess.NOT_ACESS  }; 
  }
  getFieldToAdd(){
      return {
          valueSetup: ["NodeId","CO","CO2","SO2","NO2","O3"]
      };
  }
  

  getFieldToDelete(){
      return {
          arrayCoppy:["NodeId","CO","CO2","SO2","NO2","O3"],
          locationSelect:"Time",
          valueSelect:"",
          userUpdate:""
      };
  }
  
  
  getSQLReport(currentUser){
    console.log("getSQLReport...2....... " ,currentUser.manifestid); 
      return ('SELECT extended_data.* FROM extended_data ');
       //   + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }
  getSQLCustomerReport(currentUser){
    console.log("getSQLReport...2....... " ,currentUser.manifestid); 
      return ('SELECT extended_data.* FROM extended_data ');
       //   + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind(){
      return [];
  }


}

module.exports =  ExtendedData;
