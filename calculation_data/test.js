const {CronJob: cronJob} = require('cron');
const {appConstant} = require('./constant');
const config = require('./config/default.json');
const mysql = require('mysql')
var con = mysql.createConnection(config.database);

function getRndInteger(min, max) {
    return Math.random() * (max - min) + min;
  }



new cronJob(appConstant.EVERY_10S, () => {
    console.log('=======================Inserting data into MongoDB======================');
    // let dummyData = {
    //     time: Math.round(new Date()/1000),
    //     station_id: '1012991249',
    //     aqi: Math.random() * 100,
    //     SO2_aqi: Math.random() * 1000,
    //     PM2p5_aqi: Math.random() * 500.5,
    //     PM10_aqi: Math.random() * 605,
    //     NO2_aqi: Math.random() * 2050,
    //     PM1_aqi: Math.random() * 605,
    //     CO_aqi: Math.random() * 50.5 * 1000,
    //     O3_aqi: Math.random() * 605,
    //     CO2_aqi: Math.random() * 605, 
    // }

    // const sql = `INSERT INTO aqi_data (time, station_id, aqi, SO2_aqi, PM2p5_aqi, PM10_aqi, NO2_aqi, PM1_aqi, CO_aqi, O3_aqi, CO2_aqi) VALUES (${dummyData.time}, ${dummyData.station_id}, ${dummyData.aqi}, ${dummyData.SO2_aqi}, ${dummyData.PM2p5_aqi}, ${dummyData.PM10_aqi}, ${dummyData.NO2_aqi}, ${dummyData.PM1_aqi}, ${dummyData.CO_aqi}, ${dummyData.O3_aqi}, ${dummyData.CO2_aqi})`;
    // console.log(sql);
    // con.query(sql, function (err, result) {
    //     if (err) throw err;
        
    // });

    let dummyAver = {
        time: Math.round(new Date()/1000),
        station_id: '1012991249',
        SO2: Math.random() * 1000,
        PM2p5: Math.random() * 500.5,
        PM10: Math.random() * 605,
        NO2: Math.random() * 2050,
        PM1: Math.random() * 605,
        CO: Math.random() * 50.5 * 1000,
        O3: Math.random() * 605,
        CO2: Math.random() * 605, 
        humidity: Math.random() * 100,
        temperature: getRndInteger(16, 36),
        pressure: Math.random() * 1000,
        wind_speed: Math.random() * 100,
        sound_noise: getRndInteger(15, 30)
    }

    const sql2 = `INSERT INTO data_average (time, station_id, SO2, PM2p5, PM10, NO2, PM1, CO, O3, CO2, humidity, temperature, pressure, wind_speed, sound_noise) VALUES (${dummyAver.time}, ${dummyAver.station_id}, ${dummyAver.SO2}, ${dummyAver.PM2p5}, ${dummyAver.PM10}, ${dummyAver.NO2}, ${dummyAver.PM1}, ${dummyAver.CO}, ${dummyAver.O3}, ${dummyAver.CO2}, ${dummyAver.humidity}, ${dummyAver.temperature}, ${dummyAver.pressure}, ${dummyAver.wind_speed}, ${dummyAver.sound_noise})`
    con.query(sql2, function (err, result) {
        if (err) throw err;
        
    });
},
null,   //when job strp
true,    //auto start
'Asia/Ho_Chi_Minh'
)