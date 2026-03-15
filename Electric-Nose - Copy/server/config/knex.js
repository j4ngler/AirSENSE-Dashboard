const knex = require('knex');
const database = require('./database.js');
module.exports =  knex(database);

