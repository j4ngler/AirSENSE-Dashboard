/**
 * Script insert test data vào MongoDB collection 'sensor'
 * Chạy: node insert_test_data.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const mongoConfig = require('./server/config/mongoConfig.js');

mongoose.set('strictQuery', false);

const connectOptions = {};
if (mongoConfig.username && mongoConfig.password) {
  connectOptions.user = mongoConfig.username;
  connectOptions.pass = mongoConfig.password;
}

mongoose.connect(mongoConfig.dbConfig, connectOptions)
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    const Sensor = require('./server/models/mongoDB/sensor.model.js');
    
    // Tạo test data cho 2 devices
    const testData = [
      {
        topic: 'electric-nose/device001/sensor-data',
        time: Math.floor(Date.now() / 1000) - 300, // 5 phút trước
        content: {
          Temperature: 27.5,
          Humidity: 61.2,
          ADC0: 123,
          ADC1: 456,
          ADC2: 789,
          ADC3: 101,
          ADC4: 112,
          ADC5: 131,
          ADC6: 415,
          ADC7: 161
        }
      },
      {
        topic: 'electric-nose/device001/sensor-data',
        time: Math.floor(Date.now() / 1000) - 240, // 4 phút trước
        content: {
          Temperature: 28.1,
          Humidity: 62.5,
          ADC0: 125,
          ADC1: 458,
          ADC2: 791,
          ADC3: 103,
          ADC4: 114,
          ADC5: 133,
          ADC6: 417,
          ADC7: 163
        }
      },
      {
        topic: 'electric-nose/device001/sensor-data',
        time: Math.floor(Date.now() / 1000) - 180, // 3 phút trước
        content: {
          Temperature: 28.7,
          Humidity: 63.8,
          ADC0: 127,
          ADC1: 460,
          ADC2: 793,
          ADC3: 105,
          ADC4: 116,
          ADC5: 135,
          ADC6: 419,
          ADC7: 165
        }
      },
      {
        topic: 'electric-nose/device001/sensor-data',
        time: Math.floor(Date.now() / 1000) - 120, // 2 phút trước
        content: {
          Temperature: 29.2,
          Humidity: 64.1,
          ADC0: 129,
          ADC1: 462,
          ADC2: 795,
          ADC3: 107,
          ADC4: 118,
          ADC5: 137,
          ADC6: 421,
          ADC7: 167
        }
      },
      {
        topic: 'electric-nose/device001/sensor-data',
        time: Math.floor(Date.now() / 1000) - 60, // 1 phút trước
        content: {
          Temperature: 29.8,
          Humidity: 65.4,
          ADC0: 131,
          ADC1: 464,
          ADC2: 797,
          ADC3: 109,
          ADC4: 120,
          ADC5: 139,
          ADC6: 423,
          ADC7: 169
        }
      },
      {
        topic: 'electric-nose/device001/sensor-data',
        time: Math.floor(Date.now() / 1000), // Hiện tại
        content: {
          Temperature: 30.1,
          Humidity: 66.0,
          ADC0: 133,
          ADC1: 466,
          ADC2: 799,
          ADC3: 111,
          ADC4: 122,
          ADC5: 141,
          ADC6: 425,
          ADC7: 171
        }
      },
      {
        topic: 'electric-nose/device002/sensor-data',
        time: Math.floor(Date.now() / 1000) - 180,
        content: {
          Temperature: 26.3,
          Humidity: 58.9,
          ADC0: 100,
          ADC1: 200,
          ADC2: 300,
          ADC3: 400,
          ADC4: 500,
          ADC5: 600,
          ADC6: 700,
          ADC7: 800
        }
      },
      {
        topic: 'electric-nose/device002/sensor-data',
        time: Math.floor(Date.now() / 1000),
        content: {
          Temperature: 26.8,
          Humidity: 59.5,
          ADC0: 102,
          ADC1: 202,
          ADC2: 302,
          ADC3: 402,
          ADC4: 502,
          ADC5: 602,
          ADC6: 702,
          ADC7: 802
        }
      }
    ];
    
    console.log('📝 Inserting test data...\n');
    
    // Xóa dữ liệu cũ (optional)
    const deleteResult = await Sensor.deleteMany({
      topic: { $regex: /^electric-nose\/.+\/sensor-data$/ }
    });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} old documents\n`);
    
    // Insert test data
    const result = await Sensor.insertMany(testData);
    console.log(`✅ Inserted ${result.length} test documents\n`);
    
    // Verify
    const count = await Sensor.countDocuments({
      topic: { $regex: /^electric-nose\/.+\/sensor-data$/ }
    });
    console.log(`📊 Total Electric-Nose documents: ${count}\n`);
    
    // Show sample
    const sample = await Sensor.findOne({
      topic: { $regex: /^electric-nose\/.+\/sensor-data$/ }
    }).sort({ time: -1 }).lean();
    
    if (sample) {
      console.log('📋 Latest document:');
      console.log(`   Topic: ${sample.topic}`);
      console.log(`   Time: ${new Date(sample.time * 1000).toISOString()}`);
      console.log(`   Temperature: ${sample.content.Temperature}°C`);
      console.log(`   Humidity: ${sample.content.Humidity}%`);
      console.log(`   ADC: [${sample.content.ADC0}, ${sample.content.ADC1}, ...]`);
    }
    
    console.log('\n✅ Test data inserted successfully!');
    console.log('💡 You can now test the API endpoints');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });

