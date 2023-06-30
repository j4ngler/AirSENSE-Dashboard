
var mongoConfig = require('./config/mongoConfig.js');

const mongoose = require('mongoose');

// Connecting to the database
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoConfig.dbConfig, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
});
