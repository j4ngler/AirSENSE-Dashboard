const { lastXhrs, distinctData, nowCast } = require('../utils/lastXhrs');
const {
    AQIPM25,
    AQIPM10,
    AQICO,
    AQISO21hr,
    AQISO224hr,
    AQIO38hr,
    AQIO31hr,
    AQINO2,
    AQICategory
} = require('../utils/conc-aqi')
var connectStatus = 'idle';
const config = require('../config/mysql');
const mysql = require('mysql')
var con = mysql.createConnection(config);
const fieldMysql = require('../config/default.json');




class BlockMemory {
    constructor() {
        this.status = 'available'
        this.contentAQI = [];
        this.contentAverage = [];
    }


    isAvailable() {
        return !(this.status == 'pending');
    }

    clearMemory() {
        this.contentAQI = [];
        this.contentAverage = [];
    }

    async getDataSensor() {
        // get all data of station in 1 hour nearly
        const time = Math.floor(Date.now()/1000);
        const last24 = await lastXhrs(time, 24);
        // filter no availiable records
        const last12 = last24.filter(item=>item.time > time-12*60*60).sort(function(a,b){
            if(a.time < b.time) return -1;
            if(a.time > b.time) return 1;
            return 0
        })

        // const last8 = last24.filter(item=>item.time > Date.now()-8*60*60*1000)
        // const last1 = last24.filter(item=>item.time > Date.now()-1*60*60*1000)
        const last8 = await lastXhrs(time, 8)   // For CO and O3
        const last1 = await lastXhrs(time, 1)   // For SO2, O3, and NO2


        // haven't customize
        // fetch all stations
        // const stations = await (await fetch(`${process.env.EXPRESS_URL}/webExpose/location-ids`)).json()

        const allStaions = await distinctData(time,24);
        console.log('hi giang', allStaions);
        for (const i of allStaions) {
            // console.log(i)
            const last24i = last24?.filter(item => item.topic === i)
            if(last24i.length === 0) break;
            const last12i = last12?.filter(item => item.topic === i)
            const last8i = last8?.filter(item => item.topic === i)
            const last1i = last1?.filter(item => item.topic === i)

            /** hai chất này phải dùng nowCast */
            const avgPM2p5 = last24i.reduce((prev, cur) => prev + cur.PM2p5, 0) / last24i.length   // µg/m^3
            const avgPM10 = last24i.reduce((prev, cur) => prev + cur.PM10, 0) / last24i.length     // µg/m^3
            const nowCastPM2p5 = nowCast(last12i.map(item=>item.content.PM2p5))
            // console.log(nowCastPM2p5)
            const nowCastPM10 = nowCast(last12i.map(item=>item.content.PM10))
            // console.log(nowCastPM10);
            // const avgSO224 = last24i.reduce((prev, cur) => prev + cur.SO2, 0) / last24i.length     // ppb
            // const avgCO = (last8i.reduce((prev, cur) => prev + cur.CO, 0) / last8i.length) / 1000  // ppm
            // const avgO38 = last8i.reduce((prev, cur) => prev + cur.O3, 0) / last8i.length          // ppb

            // const avgO31 = last1i.reduce((prev, cur) => prev + cur.O3, 0) / last1i.length          // ppb
            // const avgSO21 = last1i.reduce((prev, cur) => prev + cur.SO2, 0) / last1i.length        // ppb
            // const avgNO2 = last1i.reduce((prev, cur) => prev + cur.NO2, 0) / last1i.length         // ppb
            /** for update avg schema */
            const avgPM2p5hour = last1i.reduce((prev, cur) => prev + cur.content.PM2p5, 0) / last1i.length
            const avgPM10hour = last1i.reduce((prev, cur) => prev + cur.content.PM10, 0) / last1i.length     // µg/m^3
            const avgPM1hour = last1i.reduce((prev, cur) => prev + cur.content.PM1, 0) / last1i.length     // µg/m^3
            // const avgCOHour = (last1i.reduce((prev, cur) => prev + cur.CO, 0) / last1i.length) / 1000  // ppm
            const avgHumidityHour = last1i.reduce((prev, cur) => prev + cur.content.Humidity, 0) / last1i.length  // ppm
            const avgTemperatureHour = last1i.reduce((prev, cur) => prev + cur.content.Temperature, 0) / last1i.length  // ppm
            const avgPressureHour = last1i.reduce((prev, cur) => prev + cur.content.Pressure, 0) / last1i.length  // ppm
            // const avgWindspeedHour = last1i.reduce((prev, cur) => prev + cur.windSpeed, 0) / last1i.length  // ppm


            this.contentAQI.push({
                time: time,
                station_id: i.split('/')[1],
                aqi: Math.max(
                    AQIPM25(nowCastPM2p5),
                    AQIPM10(nowCastPM10),
                    // AQICO(avgCO),
                    // AQISO21hr(avgSO21),
                    // AQIO31hr(avgO31),
                    // AQINO2(avgNO2)
                ),
                PM2p5_aqi: AQIPM25(nowCastPM2p5),
                PM10_aqi: AQIPM10(nowCastPM10),
                PM1_aqi: null,
                // SO2_aqi: AQISO21hr(avgSO21),
                // NO2_aqi: AQINO2(avgNO2),
                // CO2_aqi: null,
                // CO_aqi : AQICO(avgCO),
                // O3_aqi: null,
                // aqi_category: AQICategory(Math.max(
                //     AQIPM25(nowCastPM2p5),
                //     AQIPM10(nowCastPM10),
                    // AQICO(avgCO),
                    // AQISO21hr(avgSO21),
                    // AQIO31hr(avgO31),
                    // AQINO2(avgNO2)
                // )
                // )
            })

           this.contentAverage.push({
            time: time,
            station_id: i.split('/')[1],
            // NO2: avgNO2,
            // O3: avgO31,
            // O3in8Hrs: avgO38,
            // CO: avgCOHour,
            // SO2: avgSO21,
            PM2p5: avgPM2p5hour,
            PM10: avgPM10hour,
            PM1: avgPM1hour,
            humidity: avgHumidityHour,
            temperature: avgTemperatureHour,
            pressure: avgPressureHour,
            // windSpeed: avgWindspeedHour
           })

           
        }
        // console.log('aqi', this.contentAQI);
        // console.log('average', this.contentAverage)
    }


    async saveAQIData() {
        this.status = 'pending';
        var columns = [], fields = [];
        for(let field in fieldMysql.fields) {
            columns.push(field);
        }
        columns = '(' + columns.join() +')';
        this.contentAQI.map(record => {
            // console.log(record);
            var values = [];
            for(let field in fieldMysql.fields) {
                if( record[field] && record[field] != NaN ) {
                    values.push(record[field]);
                } 
                else values.push('NULL');    
            }
            values = '(' + values.join() + ')';
            fields.push(values);
        })
        fields = fields.join();
        var sql = "INSERT INTO aqi_data "+ columns +" VALUES " + fields;
        // console.log(sql);

        con.query(sql, (error, results) => {
            if(error) throw error;
            this.status = 'available';
        })

        
    }
    async saveAverageData() {
        this.status = 'pending';
        var columns = [], fields = [];
        for(let field in fieldMysql.average_fields) {
            columns.push(field);
        }
        columns = '(' + columns.join() +')';
        this.contentAverage.map(record => {
            // console.log('testing', record);
            var values = [];
            for(let field in fieldMysql.average_fields) {
                if( record[field] ) {
                    values.push(record[field]);
                } 
                else values.push('NULL');    
            }
            values = '(' + values.join() + ')';
            fields.push(values);
        })
        fields = fields.join();
        var sql = "INSERT INTO data_average "+ columns +" VALUES " + fields;
        // console.log(sql);
        con.query(sql, (error, results) => {
            if(error) throw error;
            this.status = 'available';
        })
    }

    async updateHourly() {
        await this.getDataSensor();
        await this.saveAQIData();
        await this.saveAverageData();
        this.clearMemory()
    }
    
}

module.exports = BlockMemory;
