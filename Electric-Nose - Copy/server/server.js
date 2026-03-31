const express = require('express');
const mongoose = require('mongoose');

const app = require('./config/express.js');
const apiRoutes = require('./routes/index.route.js');
const pagesRoutes = require('./routes/pages.route.js');
const mongoConfig = require('./config/mongoConfig.js');

mongoose.set('strictQuery', false);

async function start() {
  try {
    // Kết nối MongoDB (nếu env chưa set sẽ báo lỗi rõ)
    await mongoose.connect(mongoConfig.dbConfig, {
      user: mongoConfig.username,
      pass: mongoConfig.password,
    });
    console.log('[Electric-Nose - Copy] MongoDB connected');
  } catch (err) {
    console.warn('[Electric-Nose - Copy] MongoDB connect failed:', err.message);
    // Vẫn cho server chạy để test UI/static, nhưng API Mongo sẽ lỗi khi gọi
  }

  // Start E-Nose MQTT listener (subscribe status/data from ESP32 and update Mongo/MySQL)
  try {
    require('./enose-mqtt-listener.js');
  } catch (err) {
    console.warn('[Electric-Nose - Copy] Cannot start enose-mqtt-listener:', err.message);
  }

  // Static đã set trong config/express.js

  // API
  app.use('/api', apiRoutes);
  // Pages
  app.use('', pagesRoutes);

  app.listen(app.get('port'), app.get('host'), () => {
    console.log(`Server is running at http://${app.get('host')}:${app.get('port')}`);
  });
}

start();

