const TypeModel= require('../middlewareDatabase/TypeModel.js');
const TableView= require('../middlewareDatabase/TableView.js');
const TableManifest= require('../middlewareDatabase/TableManifest.js');
const TABLE_NAME = 'sparc_posts';
const CommonModel= require('../middlewareDatabase/CommonModel.js');
const  defineManifest  = require('../../middlewares/CheckManifest.js');
const CustomerAcess= require('../middlewareDatabase/CustomerAcess.js');
/**
 * User model.
 */
class SparcPosts extends CommonModel {
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
          valueSetup: ["post_title","post_author","post_status","post_date"]
      };
  }
  getFieldToDelete(){
      return {
          arrayCoppy:["post_title","post_author","post_status","post_date","created_at","id_created"],
          locationSelect:"ID",
          valueSelect:"deleteflag",
          userUpdate:"id_updated"
      };
  }
  
  
  getSQLReport(currentUser){
    console.log("getSQLReport...2....... " ,currentUser.manifestid); 
      return ("SELECT sparc_posts.id as id, sparc_posts.post_title as post_title, sparc_posts.post_status as post_status, sparc_posts.post_date as post_date, u.fullname as post_author FROM sparc_posts LEFT JOIN users u ON u.userid=sparc_posts.post_author where sparc_posts.post_status = 'publish' AND (sparc_posts.post_title IS NOT NULL AND sparc_posts.post_title !='') AND sparc_posts.post_type = 'post'");
       //   + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind(){
      return [];
  }


}

module.exports =  SparcPosts;
