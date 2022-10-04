const TypeModel= require('../middlewareDatabase/TypeModel.js');
const TableView= require('../middlewareDatabase/TableView.js');
const TableManifest= require('../middlewareDatabase/TableManifest.js');
const TABLE_NAME = 'location';
const CommonModel= require('../middlewareDatabase/CommonModel.js');
const  defineManifest  = require('../../middlewares/CheckManifest.js');
const CustomerAcess= require('../middlewareDatabase/CustomerAcess.js');
/**
 * User model.
 */
class Location extends CommonModel {
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
          valueSetup: ["Latitude","Longtitude","Altitude","Type","PictureLinks","StartTime","StopTime","Description","ReverseGeocode","NodeId","Name","DateCreated","Status","Note","Contact","NoteStatus","Implement_TestingDate"]
      };
  }
  getFieldToDelete(){
      return {
          arrayCoppy:["Latitude","Longtitude","Altitude","Type","PictureLinks","StartTime","StopTime","Description","ReverseGeocode","NodeId","Name","DateCreated","Status","Note","Contact","NoteStatus","Implement_TestingDate"],
          locationSelect:"Id",
          valueSelect:"",
          userUpdate:""
      };
  }
  
  
  getSQLReport(currentUser){
    console.log("getSQLReport...2....... " ,currentUser.manifestid); 
      return ('SELECT location.*  FROM location ');
       //   + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind(){
      return [];
  }

}

module.exports =  Location;
