require('dotenv').config();

const client = process.env.DB_CLIENT || 'mysql';
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const database = process.env.DB_NAME || 'electric_nose';

module.exports =  {
  client,
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    user,
    password,
    database,
    charset: 'utf8',
    port: 3306,
    queueTimeout: 200000,
    acquireTimeout: 1000000,
  },
  migrations: {
    tableName: 'migrations',
    directory: process.cwd() + '/server/migrations',
  },
  debug: false,
};

