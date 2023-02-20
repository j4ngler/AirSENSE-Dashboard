
const mongoose = require('mongoose');
require('dotenv').config();

function makeNewConnection(uri) {
    const db = mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    db.on('error', function (error) {
        console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
        db.close().catch(() => console.log(`MongoDB :: failed to close connection ${this.name}`));
    });

    db.on('connected', function () {
        mongoose.set('debug', function (col, method, query, doc) {
            console.log(`MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(query)},${JSON.stringify(doc)})`);
        });
        console.log(`MongoDB :: connected ${this.name}`);
    });

    db.on('disconnected', function () {
        console.log(`MongoDB :: disconnected ${this.name}`);
    });

    return db;
}

const mongoRead = 'mongodb://' + process.env.APP_MONGO_USER_READ+':' + process.env.APP_MONGO_PASS_READ + '@' + process.env.APP_MONGO_READ+':' + process.env.APP_MONGO_PORT_READ + '/' + process.env.APP_MONGO_TABLE_READ;
const mongoWrite = 'mongodb://' + process.env.APP_MONGO_USER_WRITE+':' + process.env.APP_MONGO_PASS_WRITE +'@' + process.env.APP_MONGO_WRITE + ':' + process.env.APP_MONGO_PORT_WRITE + '/' + process.env.APP_MONGO_TABLE_WRITE;

const MongoToRead = makeNewConnection(mongoRead);
const MongoToWrite = makeNewConnection(mongoWrite);

module.exports = {
  MongoToRead,
  MongoToWrite,
};