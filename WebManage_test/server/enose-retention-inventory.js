const mongoose = require('mongoose');
const mongoConfig = require('./config/mongoConfig');
const retention = require('./enose-retention');

async function report() {
  try {
    const options = mongoConfig.username
      ? { user: mongoConfig.username, pass: mongoConfig.password }
      : {};
    await mongoose.connect(mongoConfig.dbConfig, options);
    console.table(await retention.inventory());
  } catch (error) {
    console.error('Could not read E-Nose retention inventory:', error.name);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

report();
