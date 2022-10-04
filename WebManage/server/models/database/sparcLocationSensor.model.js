const TypeModel= require('../middlewareDatabase/TypeModel.js');
const TableView= require('../middlewareDatabase/TableView.js');
const TableManifest= require('../middlewareDatabase/TableManifest.js');
const TABLE_NAME = 'sparc_location_sensor';
const CommonModel= require('../middlewareDatabase/CommonModel.js');
const  defineManifest  = require('../../middlewares/CheckManifest.js');
const CustomerAcess= require('../middlewareDatabase/CustomerAcess.js');
/**
 * User model.
 */
class SparcLocationSensor extends CommonModel {
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
          valueSetup: ["mac","station_id","location_lat","location_long","adress","content","id_group"]
      };
  }
  getFieldToDelete(){
      return {
          arrayCoppy:["mac","station_id","location_lat","location_long","adress","content","id_group","created_at","id_created"],
          locationSelect:"id",
          valueSelect:"deleteflag",
          userUpdate:"id_updated"
      };
  }
  
  
  getSQLReport(currentUser){
    console.log("getSQLReport...2....... " ,currentUser); 
      return ('SELECT sparc_location_sensor.id, sparc_location_sensor.mac, sparc_location_sensor.station_id, sparc_location_sensor.location_lat, sparc_location_sensor.location_long, sparc_location_sensor.adress, sparc_location_sensor.id_group, sparc_location_sensor.content FROM sparc_location_sensor');
       //   + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
      }
  getJsonTofind(){
      return [];
  }
  getDairyChange(info) {
    return "sparc_location_sensor.deleteflag=1";

  }


}

module.exports =  SparcLocationSensor;
