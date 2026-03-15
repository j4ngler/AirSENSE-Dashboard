var squel = require("squel");
const knex = require('../../config/knex.js');

class AuthenManager {
    constructor() {
        this.getDataInsertPost = this.getDataInsertPost.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
    }

    getInstance() {

    }

    getDataInsertPost(dataObject, table) {
        var q = squel.insert().into(table);
        let tableCheck = [{ name: true }, { fullname: true }, { phoneNumber: true }
            , { password: true }, { email: true }, { address: true }];
        Object.keys(dataObject).forEach(function (k) {
            if (tableCheck.hasOwnProperty(k)) {
                q.set(k, dataObject[k]);
            }
        });
        q.set("createat", "NOW()", { dontQuote: true });
        q.set("updateat", "NOW()", { dontQuote: true });
        q.set("deleteflag", 0);
        return q.toString();
    }

   
}

module.exports = AuthenManager;