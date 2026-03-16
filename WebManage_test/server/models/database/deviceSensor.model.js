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
          valueSetup: ["mac","station_id","longitude","latitude","address","title","type_id"]
      };
  }
  getFieldToDelete(){
      return {
          arrayCoppy:["mac","station_id","longitude","latitude","address","title","type_id","created_at","id_created"],
          locationSelect:"station_id",
          valueSelect:"delete_flag",
          userUpdate:"id_updated"
      };
  }
  
 
  getSQLReport(group_sub_id){
    console.log("getSQLReport...2....... " ,group_sub_id); 
      return ('SELECT device_sensor.station_id, de.title AS group_title, device_sensor.mac, device_sensor.longtitude, device_sensor.latitude, device_sensor.address, device_sensor.type_id, device_sensor.title, db.content AS type_sensor FROM device_sensor LEFT JOIN sensor_device_type db ON device_sensor.type_id=db.device_type_id LEFT JOIN group_device_sub de ON device_sensor.group_sub_id = de.group_device_sub_id ' +  `WHERE device_sensor.group_sub_id = ${group_sub_id};`);

      }


  getSQLCustomerReport(customerID) {
    return ('SELECT device_sensor.station_id, device_sensor.mac, device_sensor.longitude, device_sensor.latitude, device_sensor.address, device_sensor.type_id, device_sensor.title, db.content AS type_sensor FROM device_sensor LEFT JOIN sensor_device_type db ON device_sensor.type_id=db.device_type_id');
  }
  getJsonTofind(){
      return [];
  }
  getDairyChange(info) {
    return "device_sensor.delete_flag=1";

  }


}

module.exports =  DeviceSensor;
