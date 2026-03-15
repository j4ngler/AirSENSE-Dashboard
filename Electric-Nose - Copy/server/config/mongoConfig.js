require('dotenv').config();

function normalizeMongoUrl(hostFromEnv, portFromEnv, dbFromEnv) {
  const host = (hostFromEnv || 'mongodb://127.0.0.1').trim();
  const port = (portFromEnv || '27017').toString().trim();
  const db = (dbFromEnv || 'electric_nose').trim();
  const hasScheme = host.startsWith('mongodb://') || host.startsWith('mongodb+srv://');
  const base = hasScheme ? host : `mongodb://${host}`;
  // If using srv, port should not be appended
  if (base.startsWith('mongodb+srv://')) {
    return `${base}/${db}`;
  }
  return `${base}:${port}/${db}`;
}

const dbConfig = normalizeMongoUrl(
  process.env.APP_MONGO,
  process.env.APP_MONGO_PORT,
  process.env.APP_MONGO_TABLE
);

module.exports =  {
  host: process.env.APP_MONGO,
  port: process.env.APP_MONGO_PORT, 
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: process.env.APP_MONGO_USER,
  useNewUrlParser: true,
  password: process.env.APP_MONGO_PASS,
  dbConfig
};

