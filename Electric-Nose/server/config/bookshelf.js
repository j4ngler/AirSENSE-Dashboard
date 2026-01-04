const knex = require('./knex.js');
const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;

