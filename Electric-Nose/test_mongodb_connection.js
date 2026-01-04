/**
 * Script test MongoDB connection và kiểm tra dữ liệu trong collection 'sensor'
 * Chạy: node test_mongodb_connection.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const mongoConfig = require('./server/config/mongoConfig.js');

console.log('🔍 Testing MongoDB Connection...\n');
console.log('📋 Configuration:');
console.log('  - Host:', mongoConfig.host || 'mongodb://127.0.0.1');
console.log('  - Port:', mongoConfig.port || '27017');
console.log('  - Database:', process.env.APP_MONGO_TABLE || 'electric_nose');
console.log('  - Username:', mongoConfig.username || '(none)');
console.log('  - Password:', mongoConfig.password ? '***' : '(none)');
console.log('  - Connection String:', mongoConfig.dbConfig);
console.log('');

mongoose.set('strictQuery', false);

const connectOptions = {};
if (mongoConfig.username && mongoConfig.password) {
  connectOptions.user = mongoConfig.username;
  connectOptions.pass = mongoConfig.password;
}

// Test connection
mongoose.connect(mongoConfig.dbConfig, connectOptions)
  .then(async () => {
    console.log('✅ Successfully connected to MongoDB!\n');
    
    // Test 1: Kiểm tra collection 'sensor' có tồn tại không
    console.log('📊 Test 1: Checking collection "sensor"...');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const sensorCollection = collections.find(col => col.name === 'sensor');
    
    if (sensorCollection) {
      console.log('  ✅ Collection "sensor" exists');
    } else {
      console.log('  ⚠️  Collection "sensor" does not exist (will be created automatically)');
    }
    console.log('');
    
    // Test 2: Đếm số documents trong collection 'sensor'
    console.log('📊 Test 2: Counting documents in collection "sensor"...');
    // Require model sau khi đã connect MongoDB
    let Sensor;
    try {
      Sensor = require('./server/models/mongoDB/sensor.model.js');
    } catch (err) {
      console.error('  ❌ Error loading Sensor model:', err.message);
      throw err;
    }
    const totalCount = await Sensor.countDocuments();
    console.log(`  📈 Total documents: ${totalCount}`);
    console.log('');
    
    // Test 3: Đếm số documents có topic pattern electric-nose
    console.log('📊 Test 3: Counting Electric-Nose documents...');
    const enoseCount = await Sensor.countDocuments({
      topic: { $regex: /^electric-nose\/.+\/sensor-data$/ }
    });
    console.log(`  📈 Electric-Nose documents: ${enoseCount}`);
    console.log('');
    
    // Test 4: Lấy 1 document mẫu
    console.log('📊 Test 4: Getting sample document...');
    const sample = await Sensor.findOne({
      topic: { $regex: /^electric-nose\/.+\/sensor-data$/ }
    }).lean();
    
    if (sample) {
      console.log('  ✅ Sample document found:');
      console.log('    - Topic:', sample.topic);
      console.log('    - Time:', sample.time, `(${new Date(sample.time * 1000).toISOString()})`);
      console.log('    - Temperature:', sample.content?.Temperature || 'N/A');
      console.log('    - Humidity:', sample.content?.Humidity || 'N/A');
      console.log('    - ADC values:', sample.content?.ADC0 || 0, sample.content?.ADC1 || 0, '...');
    } else {
      console.log('  ⚠️  No Electric-Nose documents found');
      console.log('  💡 You may need to:');
      console.log('     1. Start the Ingestor service to save data from MQTT');
      console.log('     2. Or insert test data manually');
    }
    console.log('');
    
    // Test 5: Lấy danh sách device IDs
    console.log('📊 Test 5: Getting list of device IDs...');
    const devices = await Sensor.distinct('topic', {
      topic: { $regex: /^electric-nose\/.+\/sensor-data$/ }
    });
    
    if (devices.length > 0) {
      console.log(`  ✅ Found ${devices.length} device(s):`);
      devices.forEach((topic, index) => {
        const deviceId = topic.split('/')[1];
        console.log(`    ${index + 1}. Device ID: ${deviceId}`);
        console.log(`       Topic: ${topic}`);
      });
    } else {
      console.log('  ⚠️  No devices found');
    }
    console.log('');
    
    // Test 6: Lấy dữ liệu mới nhất của mỗi device
    if (devices.length > 0) {
      console.log('📊 Test 6: Getting latest data for each device...');
      for (const topic of devices.slice(0, 3)) { // Chỉ test 3 devices đầu tiên
        const latest = await Sensor.findOne({ topic })
          .sort({ time: -1 })
          .lean();
        
        if (latest) {
          const deviceId = topic.split('/')[1];
          console.log(`  📱 Device: ${deviceId}`);
          console.log(`     - Latest timestamp: ${new Date(latest.time * 1000).toISOString()}`);
          console.log(`     - Temperature: ${latest.content?.Temperature || 'N/A'}°C`);
          console.log(`     - Humidity: ${latest.content?.Humidity || 'N/A'}%`);
        }
      }
      console.log('');
    }
    
    // Summary
    console.log('📋 Summary:');
    console.log(`  ✅ MongoDB Connection: OK`);
    console.log(`  ✅ Collection "sensor": ${sensorCollection ? 'Exists' : 'Will be created'}`);
    console.log(`  ✅ Total documents: ${totalCount}`);
    console.log(`  ✅ Electric-Nose documents: ${enoseCount}`);
    console.log(`  ✅ Devices found: ${devices.length}`);
    
    if (enoseCount === 0) {
      console.log('\n⚠️  WARNING: No Electric-Nose data found!');
      console.log('   You may need to:');
      console.log('   1. Check if Ingestor service is running');
      console.log('   2. Check if firmware is publishing MQTT data');
      console.log('   3. Insert test data manually (see below)');
      console.log('\n💡 To insert test data, run this in MongoDB shell:');
      console.log(`
db.sensor.insertOne({
  topic: "electric-nose/device001/sensor-data",
  time: ${Math.floor(Date.now()/1000)},
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
})
      `);
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:');
    console.error('  Error:', err.message);
    console.error('\n💡 Troubleshooting:');
    console.error('  1. Check if MongoDB service is running');
    console.error('  2. Check .env file has correct MongoDB configuration');
    console.error('  3. Check network/firewall settings');
    console.error('  4. Verify MongoDB connection string:', mongoConfig.dbConfig);
    process.exit(1);
  });

