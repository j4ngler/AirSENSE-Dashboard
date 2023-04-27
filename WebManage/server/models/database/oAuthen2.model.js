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
    responseLogin(res,user){
        var dataTocken= getRamdomData(256);
        var manifestid=user.get('permission_id');
        var current_id=user.get('user_id');
        var listDataContain="";
        var listDataEnterprise_id="";
        listDataContain+=current_id;
        var authen2 = squel.insert().into("oauthen2")
                .set("permission_id",manifestid)
                .set("user_id",current_id)
                .set("token",dataTocken)
                .set('delete_flag', 0)
                .set("created_at",'NOW()',{dontQuote: true})
                .set("time_release",'NOW() + INTERVAL 1 DAY',{dontQuote: true});
        console.log("<TableManifest.NEW_REGISTER",manifestid);
        if(manifestid<TableManifest.NEW_REGISTER) {
                
                knex.raw(authen2.toString())
                .then(function(x) {
                    res.json({
                        success: true,
                        token:dataTocken,
                        email: user.get('email'),
                        userName: user.get('username')
                    });
                })
                .catch(function(err1){
                    console.log("<TableManifest.NEW_REGISTER",err1);
                    res.json({
                        success: false,
                        message: 'Problem SQL.',
                    });
                });
        } 
        else 
        {
            var sqlMain="SELECT users_id FROM user WHERE delete_flag=0 and id_created="+current_id;
            if(manifestid<TableManifest.ADMIN)
            {
                    sqlMain +=" UNION "+ "SELECT id_member FROM decentralization_access WHERE id_admin="+current_id
                    + " and deleteflag=0 and id_member!=0";
            }
            knex.raw(sqlMain).then(function(x) {
                for(var i=0;i<x[0].length;i++){
                    listDataContain+=","+x[0][i].users_id; 
                }
                var sqlMain1="SELECT enterprise_id FROM decentralization_access WHERE deleteflag=0 and id_member="+current_id;
                if(manifestid<TableManifest.ADMIN)
                {
                    sqlMain1="SELECT enterprise_id FROM decentralization_access WHERE deleteflag=0 and id_admin="+current_id;
                }
                knex.raw(sqlMain1).then(function(x) {
                    console.log("sqlMain1 ............... sqlMain1",sqlMain1,x);
                    for(var i=0;i<x[0].length;i++){
                        listDataEnterprise_id+=","+x[0][i].enterprise_id; 
                    }
                    // authen2.set("value_manifest",listDataContain)
                        // .set("enterprise_id",listDataEnterprise_id);
                    knex.raw(authen2.toString()).then(function(xa) {
                            res.json({
                                success: true,
                                token:dataTocken,
                                email: user.get('email'),
                            });
                    }).catch(function(err1){
                        console.log("<TableManifest.NEW_REGIưSTE 2R",err1);
                                res.status(HttpStatus.UNAUTHORIZED).json({
                                    success: false,
                                    message: 'Problem SQL.',
                                });
                    });
                }).catch(function(err1){
                    console.log("<TableManifest.NEW_REGISTE 2R",err1);
                    res.status(HttpStatus.UNAUTHORIZED).json({
                        success: false,
                        message: 'Problem SQL.',
                    });
                });
                
            }).catch(function(err1){
                console.log("<TableManifest.NEW_sssssREGISTE 2R",err1);
                res.status(HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    message: 'Problem SQL.',
                });
            });           
        }  
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
