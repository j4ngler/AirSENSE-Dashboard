require('dotenv').config();
const path = require('path');
const app = require('./config/express.js');
const routes = require('./routes/index.route.js');
const pagesRouters = require('./routes/pages.route.js');
const express = require('express');
const mongoose = require('mongoose');
const mongoConfig = require('./config/mongoConfig.js');

mongoose.set('strictQuery', false);

// Chỉ truyền user/pass nếu được cấu hình (MongoDB local thường không cần)
const connectOptions = {};
if (mongoConfig.username && mongoConfig.password) {
  connectOptions.user = mongoConfig.username;
  connectOptions.pass = mongoConfig.password;
}

mongoose.connect(mongoConfig.dbConfig, connectOptions).then(() => {
    console.log("✅ Successfully connected to MongoDB database");
}).catch(err => {
  console.log('⚠️ Could not connect to MongoDB database:', mongoConfig.dbConfig);
  console.log('⚠️ Error details:', err.message);
  console.log('⚠️ Server will continue running, but sensor data will not be saved to MongoDB');
  console.log('⚠️ To enable MongoDB, please start MongoDB service or update .env with remote MongoDB URL');
  // Không exit, cho phép server vẫn chạy
});

//set view engine 
app.use(express.static(__dirname + '/../public'));

// Router
app.use('/api', routes);
app.use('', pagesRouters);

app.listen(app.get('port'), app.get('host'), () => {
  console.log(`Electric-Nose Server is running at http://${app.get('host')}:${app.get('port')}`);
});

