const {
    returnOK,
    returnFalse,
    returnNotFound
  } = require('../utils/returnResponse.js')
const squel = require('squel')
const Ref_customer_home = require('../models/database/ref_customer_home.model.js');
const knex = require('../config/knex.js');
const Ref_home_device = require('../models/database/ref_home_device.model');
class DeviceController {
// GET: get list home by user_id
async getHomesByUserId(req,res,next){
   if(!req.query.user_id){
    return returnNotFound(res,{message: "invalid user_id"});
   }
   const user_id = req.query.user_id;
   var query = squel.select().field('h.home_id')
   .field('h.title').from('home', 'h').join('ref_customer_home', 'rch', 'h.home_id = rch.home_id').where('customer_id=?',user_id).toString();
   await knex.raw(query)
    .then((data)=>{
        res.json(data[0]);
    })
    .catch((err)=>{
        console.log(err);
        returnFalse(res,"error")
    });
}
// GET: list devices by home_id
async getDevicesByHomeId(req,res,next){
    if(!req.query.home_id){
        return returnNotFound(res,{message: "invalid home_id"});
    }
    const home_id = req.query.home_id;
    const query = squel.select()
            .field('d.device_id')
            .field('d.device_name')
            .field('d.status')
            .from('device', 'd')
            .join('ref_home_device', 'rhd', 'd.device_id = rhd.device_id')
            .where('rhd.home_id = ?', home_id)
            .toString();
    await knex.raw(query)
        .then((data) => res.json(data[0]))
        .catch((err) => {
            console.log(err);
            returnFalse(res,"error")
        })
}
// GET: list devices by user_id
async getListDevicesByUserId(req,res,next){
    if(!req.query.user_id){
        return returnNotFound(res,{message: "invalid user_id"});
       }
       const user_id = req.query.user_id;
       const query = squel.select()
       .field('d.device_id')
       .field('d.device_name')
       .field('d.status')
       .from('device', 'd')
       .join('ref_home_device', 'rhd', 'd.device_id = rhd.device_id')
       .join('home', 'h', 'rhd.home_id = h.home_id')
       .join('ref_customer_home', 'rch', 'h.home_id = rch.home_id')
       .where('rch.customer_id = ?', user_id)
       .toString();
            await knex.raw(query)
            .then((data) => res.json(data[0]))
            .catch((err) => {
                console.log(err);
                returnFalse(res,"error")
            })
}
// GET: list customers by home_id
async getCustomerByHomeId(req, res, next) {
    if(!req.query.home_id){
        return returnNotFound(res,{message: "invalid home_id"});
    }
    const home_id = req.query.home_id;
    const query = squel.select()
            .field('rch.customer_id')
            .from('ref_customer_home', 'rch')
            .where('rch.home_id = ?', home_id)
            .toString();
            
  await knex.raw(query)
            .then((data) => res.json(data[0]))
            .catch((err) => {
                console.log(err);
                returnFalse(res,"error")
            })
}
// GET: device by id
async getDeviceById(req, res) {
    if(!req.query.device_id){
        return returnNotFound(res,{message: "invalid device_id"});
    }
    const device_id = req.query.device_id;
    const query = squel.select()
            .field('d.device_id')
            .field('d.device_name')
            .field('d.status')
            .from('device', 'd')
            .where('d.device_id = ?', device_id)
            .toString();
    await knex.raw(query)
            .then((data) => res.json(data[0]))
            .catch((err) => {
                console.log(err);
                returnFalse(res,"error")
            })            
}
// POST: insert device 
async postDevice(req, res) {
   const home_id = req.body.home_id ?? 1;
   const status = req.body.status ?? 0;
   if (!req.body.device_name){
    return returnNotFound(res,{message: "invalid user_id"});
   }
   const device_name = req.body.device_name;
   const deviceInsert = squel.insert()
  .into('device')
  .set('device_name', device_name)
  .set('status', status)
  .toString();

// Tạo câu lệnh INSERT cho bảng "ref_home_device"
const refHomeDeviceInsert = squel.insert()
  .into('ref_home_device')
  .set('home_id', home_id)
  .set('device_id', squel.str('LAST_INSERT_ID()'))
  .toString();
  await knex.raw(deviceInsert)
   .then(()=>{
        knex.raw(refHomeDeviceInsert)
            .then(data=>{
                return returnOK(res, "inset device successfully")
            })
            .catch(err => console.log(err))
   })
   .catch(err=>{
    console.log(err);
                returnFalse(res,"error")
   })
}

}

module.exports = new DeviceController;