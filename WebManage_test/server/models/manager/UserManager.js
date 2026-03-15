var squel = require("squel");
const knex = require('../../config/knex.js');

class UserManager {
    constructor() {}

    getUserById(id) {
        var query = squel.select().from("users").where('userid ='+ id);
        query.join( "manifest_authen", null, squel.expr().and("manifest_authen.manifestid = users.manifestid"));
        return new Promise( ( resolve, reject ) => {
            knex.raw(query.toString()).then(function(result) { 
                resolve( result[0]);
            }).catch(function(err){ return reject(err);} )
        });
    }

    updateUser(user) {
        console.log('user: ', user);
        var query = squel.update()
        .table("users")
        .set("fullname", user.fullname)
        .set("email", user.email)
        .set("phoneNumber", user.phone)
        .set("contact", user.contact)
        .where("userid = " +user.userid)
        .toString();
        return new Promise( ( resolve, reject ) => {
            knex.raw(query.toString()).then(function(result) {
                resolve(result)
            })
        });
    }
}

module.exports = UserManager;