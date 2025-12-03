const TypeModel= require('../middlewareDatabase/TypeModel.js');
const TableView= require('../middlewareDatabase/TableView.js');
const TABLE_NAME = 'oauthen2';
const TableManifest= require('../middlewareDatabase/TableManifest.js');
const knex = require('../../config/knex.js');
const CommonModel= require('../middlewareDatabase/CommonModel.js');
var squel = require("squel");
const  defineManifest  = require('../../middlewares/CheckManifest.js');
const HttpStatus = require('http-status-codes');
const CustomerAcess= require('../middlewareDatabase/CustomerAcess.js');
const  {getRamdomData}  = require('../../utils/utilsString.js');
const {API_LOGIN, API_GET_USER} = require("../../config/configApi.js")
const AxiosSupport = require('../../utils/axiosSupport.js')
/**
 * Enterprise model.
 */
class Oauthen2 extends CommonModel {
  /**
   * Get table name.
   */
  get tableName() {
    return TABLE_NAME;
  }
  getTypeTable(){ return TypeModel.SELL_PRODUCT;}
  customerAcess(){ 
    return  {edit:CustomerAcess.NOT_ACESS,
             add:CustomerAcess.NOT_ACESS,
             view:CustomerAcess.NOT_ACESS  }; 
  }
  /**
   * Table has timestamps.
   */
    checkInvalUserExistingTocken(token){
        var authen = squel.select().from("oauthen2")
                        .where("token = '"+token+"'" )
                        .where("delete_flag = 0")
                        .where("time_release > NOW()");
        return new Promise( ( resolve, reject ) => {
            //console.log(authen.toString(),tocken);
            knex.raw(authen.toString()).then(function(result) {
              //  console.log("checkInvalUserExistingTocken ok",result[0]);
                resolve( result[0] );
            }).catch(function(err){
                console.log("checkInvalUserExistingTocken erro");
                return reject(err);
            } )
        } );
    }
    async actionLogin(token){
        await AxiosSupport.getMethod(API_GET_USER,token)
          .then((res)=> {
            var authen2 = squel.insert().into("oauthen2")
                .set("permission_id",res.data.user.permission_id)
                .set("user_id",res.data.user.user_id)
                .set("token",token)
                .set('delete_flag', 0)
                .set("created_at",'NOW()',{dontQuote: true})
                .set("time_release",'NOW() + INTERVAL 1 DAY',{dontQuote: true});

            knex.raw(authen2.toString())
            .then(res => console.log("true",res))
            .catch(err => console.log("err",err))
          })
          .catch(err => console.log(err))
    }



  get hasTimestamps() {
    return true;
  }
  getNameTable(){ return TABLE_NAME;}

    

    getJsonTofind(){
        return [];
    }
    getFieldToAdd(){
        return {
            valueSetup: [ "manifestid","userid","tocken","value_manifest"]
        };
    }
    getFieldToDelete(){
        return {
            arrayCoppy:["manifestid","userid","tocken","value_manifest","created_at","id_created"],
            locationSelect:"id",
            valueSelect:"deleteflag",
            userUpdate:"id_updated"
        };
    }
    
    
    getSQLReport(currentUser){
        return 'SELECT oauthen2.*, db.username As namecreate ,dc.username As nameupdate ,dg.content as contentauthen,dn.username as userauthen FROM oauthen2 LEFT JOIN users db ON db.users_id=oauthen2.id_created LEFT JOIN users dc ON dc.users_id=oauthen2.id_updated LEFT JOIN permission dg ON dg.permission_id=oauthen2.permission_id LEFT JOIN users dn ON dn.users_id=oauthen2.userid';
    }
    

    
}

module.exports =  Oauthen2;
