const TypeModel= require('../middlewareDatabase/TypeModel.js');
const CustomerAcess= require('../middlewareDatabase/CustomerAcess.js');
const CommonModel= require('../middlewareDatabase/CommonModel.js');


class ProductImage extends CommonModel {
  get tableName() {  return "product_image";}
  getNameTable(){ return 'product_image';}
  getTypeTable(){ return TypeModel.SELL_PRODUCT;}

  customerAcess(){ 
    return  {edit:CustomerAcess.ONLY_USER,
             add:CustomerAcess.ONLY_USER,
             view:CustomerAcess.ONLY_USER  }; 
  }

  getFieldToAdd(){
      return {
          valueSetup: ["product_variant_id","link_url"]
      };
  }
  getFieldToDelete(){
      return {
          arrayCoppy:["product_variant_id","link_url"],
          locationSelect:"product_image_id",
          valueSelect:"delete_flag",
          userUpdate:"id_updated"
      };
  }
  
  
  getSQLReport(currentUser){
    console.log("getSQLReport...2....... " ,currentUser.permission_id); 
      return ('SELECT product_image.* FROM product_image ');
         // + defineManifest.checkManifestTableUser(currentUser.permission_id,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind(){
      return ["link_url","cost_detail","cost_real","promotion"];
  }

  
}

module.exports =  ProductImage;
