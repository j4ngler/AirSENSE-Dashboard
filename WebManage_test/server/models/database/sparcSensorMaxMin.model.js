const TypeModel= require('../middlewareDatabase/TypeModel.js');
const TableView= require('../middlewareDatabase/TableView.js');
const TableManifest= require('../middlewareDatabase/TableManifest.js');
const TABLE_NAME = 'sparc_sensor_max_min';
const CommonModel= require('../middlewareDatabase/CommonModel.js');
const  defineManifest  = require('../../middlewares/CheckManifest.js');
const CustomerAcess= require('../middlewareDatabase/CustomerAcess.js');
/**
 * User model.
 */
class SparcSensorMaxMin extends CommonModel {
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
          valueSetup: ["station_id","pm25_max","pm25_min","pm25_max_enanble","pm25_min_enanble",
          "pm10_max","pm10_min","pm10_max_enanble","pm10_min_enanble","pm1_max",
          "pm1_min","pm1_max_enanble","pm1_min_enanble","temp_max","temp_min",
          "temp_max_enanble","temp_min_enanble","humid_max","humid_min","humid_max_enanble",
          "humid_min_enanble","special","flagdelete"]
      };
  }
  getFieldToDelete(){
      return {
          arrayCoppy:["station_id","pm25_max","pm25_min","pm25_max_enanble","pm25_min_enanble",
          "pm10_max","pm10_min","pm10_max_enanble","pm10_min_enanble","pm1_max",
          "pm1_min","pm1_max_enanble","pm1_min_enanble","temp_max","temp_min",
          "temp_max_enanble","temp_min_enanble","humid_max","humid_min","humid_max_enanble",
          "humid_min_enanble","special","flagdelete","created_at","id_created"],
          locationSelect:"id",
          valueSelect:"deleteflag",
          userUpdate:"id_updated"
      };
  }
  
  
  getSQLReport(currentUser){
    console.log("getSQLReport...2....... " ,currentUser.manifestid); 
      return ('SELECT * FROM sparc_sensor_max_min ');
       //   + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind(){
      return [];
  }
  getDairyChange(info) {
    return "sparc_sensor_max_min.deleteflag=1";

  }


}

module.exports =  SparcSensorMaxMin;
