const {
    returnOK,
    returnFalse,
    returnNotFound
  } = require('../utils/returnResponse.js')
const squel = require('squel')
const Ref_customer_home = require('../models/database/ref_customer_home.model.js');
const knex = require('../config/knex.js');
class DeviceController {
// GET: get list home by user_id
async getHomesByUserId(req,res,next){

   if(!req.query.user_id){
    return returnNotFound(res,{message: "invalid user_id"});
   }
   const user_id = req.query.user_id;
   var query = squel.select().from(Ref_customer_home.TableName).where('customer_id=?',user_id).toString();
   await knex.raw(query)
    .then((data)=>{
        res.json(data[0]);
    })
    .catch((err)=>{
        console.log(err);
        returnFalse(res,"error")
    });
}

}

module.exports = new DeviceController;