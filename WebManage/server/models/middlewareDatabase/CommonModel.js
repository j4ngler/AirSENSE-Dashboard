const bookshelf = require('../../config/bookshelf.js');
const TableView= require('./TableView.js');
const TypeModel= require('./TypeModel.js');
var squel = require("squel");
const TableManifest= require('./TableManifest.js');
const TABLE_NAME = 'address';
const  defineManifest  = require('../../middlewares/CheckManifest.js');
const knex = require('../../config/knex.js');
const CustomerAcess= require('./CustomerAcess.js');
// const bcrypt = require('bcrypt');


class CommonModel extends bookshelf.Model {

    async queryDatabase(sql){
        try
        {
            var data= await  knex.raw(sql);
            if(data==null) return false;
            return data[0];
        }
        catch(ie){
            return false;
        }
    }

    checkAcessGetDatabase(permission_id,type){
        console.log("dataTableSQL   ",permission_id,type);
        if(permission_id==TableManifest.MASTER){
            return true;
        } else if(permission_id==TableManifest.MANAGER){
            return true;
        } else if(permission_id==TableManifest.SUPPORT){
            return true;
        }  else if(permission_id==TableManifest.ACCOUNT){
            return true;
        }  else if(permission_id==TableManifest.ADMIN){
            return true;
        }  
        return false;
    }
    
    checkDataAddDatabase(permission_id,type){
        if(permission_id==TableManifest.MASTER){
            return true;
        } else if(permission_id==TableManifest.MANAGER){
            return true;
        } else if(permission_id==TableManifest.SUPPORT){
            return true;
        }  else if(permission_id==TableManifest.ACCOUNT){
            return false;
        }  else if(permission_id==TableManifest.ADMIN){
            return true;
        }  
        return false;
    }

    checkDataEditDatabase(permission_id,type){
        if(permission_id==TableManifest.MASTER){
            return true;
        } else if(permission_id==TableManifest.MANAGER){
            return true;
        }  else if(permission_id==TableManifest.ADMIN){
            if(TypeModel.NEWS==type) return true;
            else if(TypeModel.TEST==type) return true;
        }  
        return false;
    }

    checkDataDeleteDatabase(permission_id,type){
        if(permission_id==TableManifest.MASTER){
            return true;
        }  else if(permission_id==TableManifest.MANAGER){
            return true;
        }  else if(permission_id==TableManifest.ACCOUNT){
            return false;
        }  else if(permission_id==TableManifest.ADMIN){
            //if(TypeModel.SELL_PRODUCT==type) return true;
            return false;
        }  
        return false;
    }

    addFormToTableSQL(data){
        var userid=0;
        let dataUser=  this.getFieldToAdd();//  DataTableFieldAdd[table];
        var authenSql = squel.insert().into(this.getNameTable());
        for(var i=0;i<dataUser.valueSetup.length;i++){
            let item=dataUser.valueSetup[i];
            if(!!!data[item]) authenSql.set(item,null);
            else
            authenSql.set(item,data[item]);
        }
        authenSql.set("id_created",userid).set("id_updated",userid)
        .set("created_at","NOW()",{dontQuote: true}) 
        .set("updated_at","NOW()",{dontQuote: true})
        .set("deleteflag",0);
        return authenSql.toString();
    }

    checkDataInform(){
        let dataUser=  this.getFieldToAdd();//  DataTableFieldAdd[table];
        var dataInfo={};
        for(var i=0;i<dataUser.valueSetup.length;i++){
            let item=dataUser.valueSetup[i];
            dataInfo[item]="";
        }
        return dataInfo;
    }
    // this function to check special info
    async checkManifestSpecialTable(table,request){
        console.log("checkManifestSpecialTable",table);
        if(table=='users'){
            if(request.currentUser.manifestid<=TableManifest.NEW_REGISTER)
            {
                var checkUsser = squel.select().from('users')
                              .where("email='"+request.body["email"]+"'")
                              .where("deleteflag=0");
                var result= await knex.raw(checkUsser.toString());
                console.log("checkManifestSpecialTable result",result[0]);
                if ((result==null)||(result[0].length==0)) {
                    console.log("checkManifestSpecialTable result s",request.currentUser.manifestid,request.body.permission_id);
                    if(request.currentUser.manifestid<=request.body.permission_id){
                        return true;
                    }
                }
            }
            
            return false;
        }
        return true;
    }

    async checkSqlAddAdmin(req,data){
        var userid=req.currentUser.users_id;
        let dataUser=  this.getFieldToAdd();//  DataTableFieldAdd[table];
        var sqlQuery = squel.insert().into(this.getNameTable());
        if(this.getNameTable()=='user' || this.getNameTable() == 'customer'){
            for(var i=0;i<dataUser.valueSetup.length;i++){
                let item=dataUser.valueSetup[i];
                if(!!!data[item]) sqlQuery.set(item,null);
                else {
                    if(item == "password"){
                        const salt = await bcrypt.genSalt(12);
                        // now we set user password to hashed password
                        var passwordData = 'ebrs';
                        sqlQuery.set(item,passwordData);
                    }
                    else {
                        sqlQuery.set(item,data[item]);
                    }
                }
                   
            }
        }
        else
        {
            for(var i=0;i<dataUser.valueSetup.length;i++){
                let item=dataUser.valueSetup[i];
                if(!!!data[item]) sqlQuery.set(item,null);
                else {
                    sqlQuery.set(item,data[item]);
                }
                   
            }
        }
        
        sqlQuery.set("id_created",userid).set("id_updated",userid)
            .set("created_at","NOW()",{dontQuote: true}) 
            .set("updated_at","NOW()",{dontQuote: true})
            .set("delete_flag",0);

        console.log(sqlQuery.toString())
        return sqlQuery.toString();
    }
    
    async checkSqlUpdateAdmin(req,data){
        var userid=req.currentUser.users_id;
        let dataUser=  this.getFieldToDelete();//  DataTableFieldAdd[table];
        var sqlQuery = squel.update().table(this.getNameTable());
        if(this.getNameTable()=='users'){
            for(var i=0;i<dataUser.arrayCoppy.length;i++){
                let item=dataUser.arrayCoppy[i];
                if(!!!data[item]) sqlQuery.set(item,null);
                else {
                    if(item=="password"){
                        const salt = 'detbg';
                        // now we set user password to hashed password
                        var passwordData = 'btheda';
                        sqlQuery.set(item,passwordData);
                    }
                    else if(item=="email"){
                        // email not change
                    }
                    else {
                        sqlQuery.set(item,data[item]);
                    }
                }
                   
            }
        }
        else
        {
            for(var i=0;i<dataUser.arrayCoppy.length;i++){
                let item=dataUser.arrayCoppy[i];
                if(!!!data[item]) sqlQuery.set(item,null);
                else {
                    sqlQuery.set(item,data[item]);
                }
                   
            }
        }
        sqlQuery.set("id_updated",userid)
                    .set("created_at","NOW()",{dontQuote: true})
                    .set("updated_at","NOW()",{dontQuote: true})
                    .set("deleteflag",0)
                    .where(dataUser.locationSelect+'='+data[dataUser.locationSelect]);

        return sqlQuery.toString();
    } 


    checkManifestSpecialCustomer(action){
        var acess = this.customerAcess();
        var detail = acess[action];
        switch(detail){
            case CustomerAcess.NOT_ACESS:{
                return false;
            }
            case CustomerAcess.ONLY_USER:{
                return true;
            }
            case CustomerAcess.ALL:{
                return true;
            }
            default:{
                return false;
            }
            return false;
        }
        return false;
    }

    
    async  checkDataToEdit(req){
        let data=req.body;
        let dataUser= this.getFieldToDelete();
        var getInfoData = squel.select().from(req.body.table).where("deleteflag=0");
        if(Number.isInteger(data[dataUser.locationSelect]))
            getInfoData.where(dataUser.locationSelect+"="+data[dataUser.locationSelect]+"");
        else
            getInfoData.where(dataUser.locationSelect+"='"+data[dataUser.locationSelect]+"'");
            console.log(" req.currentUser req.currentUser getInfoData.toString()",getInfoData.toString());
        var result= await knex.raw(getInfoData.toString());
        console.log(" req.currentUser req.currentUser 1 ",req.currentUser,result[0][0]);
        if ((result==null)||(result[0].length==0)) {
            return false
        }
        if(req.body.table=='users'){
        //console.log(" req.currentUser req.currentUser  2",req.currentUser,result[0][0]);
        console.log(" req.currentUser req.currentUser 2",result[0][0].manifestid,req.currentUser.manifestid);
            if(result[0][0].permission_id==req.currentUser.manifestid){
                console.log(" req.currentUser req.currentUser 1");
                if(result[0][0].users_id==req.currentUser.users_id)  return true;
                console.log(" req.currentUser req.currentUser 1 a");
            }
            else if(result[0][0].permission_id <req.currentUser.manifestid){
                console.log(" req.currentUser req.currentUser 2");
                return false;
            } else if(result[0][0].permission_id >req.currentUser.manifestid){
                console.log(" req.currentUser req.currentUser 2");
                return true;
            }
            console.log(" req.currentUser req.currentUser 3a",req.currentUser);
            if((req.currentUser.manifestid==TableManifest.MASTER)){
                return true;
            }
            else
            {
                console.log(" req.currentUser req.currentUser 3a x",req.currentUser);
                if(!this.checkDataToManifest(result[0][0].id_created,req.currentUser.value_manifest)){
                    return false;
                }
            }
            return false;
        }
        else
        {
            if((req.currentUser.manifestid==TableManifest.MASTER)||
                    (req.currentUser.manifestid==TableManifest.MANAGER )){
                return true;
            }
            else
            {
                if(!this.checkDataToManifest(result[0][0].id_created,req.currentUser.value_manifest)){
                return false;
                }
            }
        }
        return true;
    }

    checkDataToManifest=(id, select)=>{
        var dataArray= select.split(",");
        for(var u=0;u<dataArray.length;u++){
          if(dataArray[u]==id){
            return true;
          }
        }
        return false;
      
    }
    getValueToSelectToFind(data){
        var stringData="";
        var arrayTofind = this.getJsonTofind();
        var tableSelect = this.getNameTable();
        console.log("getValueToSelectToFind .........",data,arrayTofind,tableSelect);
        if(!!data){
          for(var i=0;i<arrayTofind.length;i++){
              if(!!data[arrayTofind[i]]){
                  if(data[arrayTofind[i]]!=null){
                      stringData += " AND "+ tableSelect+"."+arrayTofind[i]+" = " +data[arrayTofind[i]]+" ";
                  }
              }
          }
        }
        return stringData;
    }
    getConditionManisfest(info){
        return this.getNameTable()  +".delete_flag=0 ";
    }

  }

  module.exports =  CommonModel;