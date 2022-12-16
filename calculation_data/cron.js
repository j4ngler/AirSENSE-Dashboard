const {CronJob: cronJob} = require('cron');
const {appConstant} = require('./constant');
const config = require('./config/default.json');
const mysql = require('mysql')
var con = mysql.createConnection(config.database);
const mongoose = require('mongoose');
const mongoConfig = require('./config/configMqtt');


mongoose.connect(mongoConfig.dbConfig, {user: mongoConfig.username, pass:mongoConfig.password}).then(() => {
    console.log("Successfully connected to the database");
    })
    .catch(err => {
    console.log(mongoConfig.dbConfig)
    console.log(mongoConfig.username,mongoConfig.password)
    console.log('Could not connect to the database. Exiting now...', err);
})



new cronJob(appConstant.EVERY_10S, () => {
    console.log('=======================Inserting data into MongoDB======================');
    


    // let dummyAver = {
    //     time: Math.round(new Date()/1000),
    //     station_id: '1012991249',
    //     SO2: Math.random() * 1000,
    //     PM2p5: Math.random() * 500.5,
    //     PM10: Math.random() * 605,
    //     NO2: Math.random() * 2050,
    //     PM1: Math.random() * 605,
    //     CO: Math.random() * 50.5 * 1000,
    //     O3: Math.random() * 605,
    //     CO2: Math.random() * 605, 
    //     humidity: Math.random() * 100,
    //     temperature: getRndInteger(16, 36),
    //     pressure: Math.random() * 1000,
    //     wind_speed: Math.random() * 100,
    //     sound_noise: getRndInteger(15, 30)
    // }

    // const sql2 = `INSERT INTO data_average (time, station_id, SO2, PM2p5, PM10, NO2, PM1, CO, O3, CO2, humidity, temperature, pressure, wind_speed, sound_noise) VALUES (${dummyAver.time}, ${dummyAver.station_id}, ${dummyAver.SO2}, ${dummyAver.PM2p5}, ${dummyAver.PM10}, ${dummyAver.NO2}, ${dummyAver.PM1}, ${dummyAver.CO}, ${dummyAver.O3}, ${dummyAver.CO2}, ${dummyAver.humidity}, ${dummyAver.temperature}, ${dummyAver.pressure}, ${dummyAver.wind_speed}, ${dummyAver.sound_noise})`
    // con.query(sql2, function (err, result) {
    //     if (err) throw err;
        
    // });
},
null,   //when job strp
true,    //auto start
'Asia/Ho_Chi_Minh'
)