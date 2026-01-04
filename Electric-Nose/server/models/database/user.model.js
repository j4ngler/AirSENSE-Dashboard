const bookshelf = require('../../config/bookshelf.js');
const TABLE_NAME = "users";

const User = bookshelf.Model.extend({
  tableName: TABLE_NAME,
  hasTimestamps: true,
});

module.exports = User;

