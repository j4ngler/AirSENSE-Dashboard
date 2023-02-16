const TypeModel= require('../middlewareDatabase/TypeModel.js');
const CommonModel= require('../middlewareDatabase/CommonModel.js');
const CustomerAcess= require('../middlewareDatabase/CustomerAcess.js');
/**
 * User model.
 */
class ProductGroup extends CommonModel {
    get tableName() {  return "product_group";}
    getNameTable(){ return 'product_group';}
    getTypeTable(){ return TypeModel.SELL_PRODUCT;}
    customerAcess(){ 
        return  {edit:CustomerAcess.ONLY_USER,
                add:CustomerAcess.ONLY_USER,
                view:CustomerAcess.ONLY_USER  }; 
    }
    getFieldToAdd(){
        return {
            valueSetup: ["title"]
        };
    }
    getFieldToDelete(){
        return {
            arrayCoppy:["title","created_at","created_id"],
          	locationSelect:"product_group_id",
            valueSelect:"delete_flag",
            userUpdate:"updated_id"
        };
    }
    
    
    getSQLReport(currentUser){
        return ('SELECT product_group.* FROM product_group ');
            // + defineManifest.checkManifestTableUser(currentUser.permission_id,currentUser.users_id,currentUser.value_manifest));
    }
    getJsonTofind(){
        return ["title"];
    }

}

module.exports =  ProductGroup;
