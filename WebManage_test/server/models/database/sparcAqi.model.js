const TypeModel= require('../middlewareDatabase/TypeModel.js');
const TableView= require('../middlewareDatabase/TableView.js');
const TableManifest= require('../middlewareDatabase/TableManifest.js');
const TABLE_NAME = 'sparc_aqi';
const CommonModel= require('../middlewareDatabase/CommonModel.js');
const  defineManifest  = require('../../middlewares/CheckManifest.js');
const CustomerAcess= require('../middlewareDatabase/CustomerAcess.js');
/**
 * User model.
 */
class SparcAqi extends CommonModel {
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
          valueSetup: ["aqi","SO2_aqi","PM25_aqi","station_id","PM10_aqi","NO2_aqi","PM1_aqi","CO_aqi","O3_aqi","CO2_aqi"]
      };
  }
  

  getFieldToDelete(){
      return {
          arrayCoppy:["aqi","SO2_aqi","PM25_aqi","station_id","PM10_aqi","NO2_aqi","PM1_aqi","CO_aqi","O3_aqi","CO2_aqi"],
          // locationSelect:"time",
          locationSelect: "station_id",
          valueSelect:"",
          userUpdate:""
      };
  }
  
  
  getSQLReport(currentUser){
    console.log("getSQLReport...2....... " ,currentUser.manifestid); 
      return ('SELECT aqi_data.* FROM aqi_data ');
       //   + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind(){
      return [];
  }


}

module.exports =  SparcAqi;
