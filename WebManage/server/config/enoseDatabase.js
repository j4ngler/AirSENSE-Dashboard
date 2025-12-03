require('dotenv').config();

// Database config riêng cho E-Nose
// Có thể dùng chung database AirSENSE hoặc database riêng
module.exports = {
  client: process.env.ENOSE_DB_CLIENT || process.env.DB_CLIENT || 'mysql',
  connection: {
    host: process.env.ENOSE_DB_HOST || process.env.DB_HOST || '127.0.0.1',
    user: process.env.ENOSE_DB_USER || process.env.DB_USER,
    password: process.env.ENOSE_DB_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.ENOSE_DB_NAME || 'electric_nose',
    charset: 'utf8',
    port: 3306,
    queueTimeout: 200000,
    acquireTimeout: 1000000,
  },
  debug: false,
};

