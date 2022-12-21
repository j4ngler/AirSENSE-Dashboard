const TypeModel= require('../middlewareDatabase/TypeModel.js');
const TableView= require('../middlewareDatabase/TableView.js');
const TableManifest= require('../middlewareDatabase/TableManifest.js');
const TABLE_NAME = 'device_sensor';
const CommonModel= require('../middlewareDatabase/CommonModel.js');
const  defineManifest  = require('../../middlewares/CheckManifest.js');
const CustomerAcess= require('../middlewareDatabase/CustomerAcess.js');
/**
 * User model.
 */
class DeviceSensor extends CommonModel {
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
          valueSetup: ["mac","station_id","longtitude","latitide","adsress","title","type_id"]
      };
  }
  getFieldToDelete(){
      return {
          arrayCoppy:["mac","station_id","longtitude","latitude","address","title","type_id","created_at","id_created"],
          locationSelect:"station_id",
          valueSelect:"delete_flag",
          userUpdate:"id_updated"
      };
  }
  
  
  getSQLReport(currentUser){
    console.log("getSQLReport...2....... " ,currentUser); 
      return ('SELECT device_sensor.station_id, device_sensor.mac, device_sensor.longtitude, device_sensor.latitude, device_sensor.address, device_sensor.type_id, device_sensor.title, db.content AS type_sensor FROM device_sensor LEFT JOIN sensor_device_type db ON device_sensor.type_id=db.device_type_id');
       //   + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
      }


  getSQLCustomer(customerID) {
    console.log(customerID);
    return ('SELECT device_sensor.station_id, device_sensor.mac, device_sensor.longtitude, device_sensor.latitude, device_sensor.address, device_sensor.type_id, device_sensor.title, db.content AS type_sensor FROM device_sensor LEFT JOIN sensor_device_type db ON device_sensor.type_id=db.device_type_id');
  }
  getJsonTofind(){
      return [];
  }
  getDairyChange(info) {
    return "device_sensor.delete_flag=1";

  }


}

module.exports =  DeviceSensor;
