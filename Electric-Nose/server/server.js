const path = require('path');
const app = require('./config/express.js');
const routes = require('./routes/index.route.js');
const pagesRouters = require('./routes/pages.route.js');
const express = require('express');
const mongoose = require('mongoose');
const mongoConfig = require('./config/mongoConfig.js');
const { password } = require('./config/mongoConfig.js');

mongoose.set('strictQuery', false);
mongoose.connect(mongoConfig.dbConfig, {user: mongoConfig.username, pass:password}).then(() => {
    console.log("Successfully connected to MongoDB database");
}).catch(err => {
  console.log(mongoConfig.dbConfig)
  console.log(mongoConfig.username,mongoConfig.password)
    console.log('Could not connect to MongoDB database. Exiting now...', err);
});

//set view engine 
app.use(express.static(__dirname + '/../public'));

// Router
app.use('/api', routes);
app.use('', pagesRouters);

app.listen(app.get('port'), app.get('host'), () => {
  console.log(`Electric-Nose Server is running at http://${app.get('host')}:${app.get('port')}`);
});

