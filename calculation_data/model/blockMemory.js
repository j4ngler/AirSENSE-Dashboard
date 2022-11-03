const { lastXhrs, distinctData } = require('../utils/lastXhrs');
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


class BlockMemory {
    constructor() {
        this.status = 'available'
        this.contentAQI = [];
        this.contentAverage = [];
    }

    async add(record) {
        await this.getDataSensor();
        try {
        this.saveAQIData();
        // this.saveAverageData();
        }
        catch(e) {

        }
    }

    isAvailable() {
        return (!this.status == 'pending');
    }

    clearMemory() {
        this.contentAQI = [];
        this.contentAverage = [];
    }

    async getDataSensor() {

        const last24 = await lastXhrs(24) // For PM2.5, PM10, and SO2
        const last12 = last24.filter(item=>item.time > Date.now()-12*60*60*1000).sort(function(a,b){
            if(a.time < b.time) return -1;
            if(a.time > b.time) return 1;
            return 0
        })
        const last8 = last24.filter(item=>item.time > Date.now()-8*60*60*1000)
        const last1 = last24.filter(item=>item.time > Date.now()-1*60*60*1000)
        // const last8 = await lastXhrs(8)   // For CO and O3
        // const last1 = await lastXhrs(1)   // For SO2, O3, and NO2


        // haven't customize
        // fetch all stations
        // const stations = await (await fetch(`${process.env.EXPRESS_URL}/webExpose/location-ids`)).json()

        const allStaions = await distinctData(24);
        for (const i of allStaions) {
            const last24i = last24?.filter(item => item.station_id === i)
            if(last24i.length === 0) break;
            const last12i = last12?.filter(item => item.station_id === i)
            const last8i = last8?.filter(item => item.station_id === i)
            const last1i = last1?.filter(item => item.station_id === i)

            /** hai chất này phải dùng nowCast */
            // const avgPM2p5 = last24i.reduce((prev, cur) => prev + cur.PM2p5, 0) / last24i.length   // µg/m^3
            // const avgPM10 = last24i.reduce((prev, cur) => prev + cur.PM10, 0) / last24i.length     // µg/m^3
            const nowCastPM2p5 = nowCast(last12i.map(item=>item.PM2p5))
            const nowCastPM10 = nowCast(last12i.map(item=>item.PM10))
            const avgSO224 = last24i.reduce((prev, cur) => prev + cur.SO2, 0) / last24i.length     // ppb
            const avgCO = (last8i.reduce((prev, cur) => prev + cur.CO, 0) / last8i.length) / 1000  // ppm
            const avgO38 = last8i.reduce((prev, cur) => prev + cur.O3, 0) / last8i.length          // ppb

            const avgO31 = last1i.reduce((prev, cur) => prev + cur.O3, 0) / last1i.length          // ppb
            const avgSO21 = last1i.reduce((prev, cur) => prev + cur.SO2, 0) / last1i.length        // ppb
            const avgNO2 = last1i.reduce((prev, cur) => prev + cur.NO2, 0) / last1i.length         // ppb
            /** for update avg schema */
            const avgPM2p5hour = last1i.reduce((prev, cur) => prev + cur.PM2p5, 0) / last1i.length
            const avgPM10hour = last1i.reduce((prev, cur) => prev + cur.PM10, 0) / last1i.length     // µg/m^3
            const avgCOHour = (last1i.reduce((prev, cur) => prev + cur.CO, 0) / last1i.length) / 1000  // ppm
            const avgHumidityHour = last1i.reduce((prev, cur) => prev + cur.humidity, 0) / last1i.length  // ppm
            const avgTemperatureHour = last1i.reduce((prev, cur) => prev + cur.temperature, 0) / last1i.length  // ppm
            const avgPressureHour = last1i.reduce((prev, cur) => prev + cur.pressure, 0) / last1i.length  // ppm
            const avgWindspeedHour = last1i.reduce((prev, cur) => prev + cur.windSpeed, 0) / last1i.length  // ppm


            this.contentAQI.push({
                time: '',
                station_id: i,
                aqi: Math.max(
                    AQIPM25(nowCastPM2p5),
                    AQIPM10(nowCastPM10),
                    AQICO(avgCO),
                    AQISO21hr(avgSO21),
                    AQIO31hr(avgO31),
                    AQINO2(avgNO2)
                ),
                PM2p5_aqi: AQIPM25(nowCastPM2p5),
                PM10_aqi: AQIPM10(nowCastPM10),
                PM1_aqi: null,
                SO2_aqi: AQISO21hr(avgSO21),
                NO2_aqi: AQINO2(avgNO2),
                CO2_aqi: null,
                CO_aqi : AQICO(avgCO),
                O3_aqi: null,
                aqi_category: AQICategory(Math.max(
                    AQIPM25(nowCastPM2p5),
                    AQIPM10(nowCastPM10),
                    AQICO(avgCO),
                    AQISO21hr(avgSO21),
                    AQIO31hr(avgO31),
                    AQINO2(avgNO2)
                ))
            })

           this.contentAverage.push({
            time: '',
            station_id: i,
            NO2: avgNO2,
            O3: avgO31,
            O3in8Hrs: avgO38,
            CO: avgCOHour,
            SO2: avgSO21,
            PM2p5: avgPM2p5hour,
            PM10: avgPM10hour,
            humidity: avgHumidityHour,
            temperature: avgTemperatureHour,
            pressure: avgPressureHour,
            windSpeed: avgWindspeedHour
           })
        }
    }


    saveAQIData() {
        var self = this;
        this.status = 'pending';
        var columns = [], fields = [];
        for(var field in config.fields) {
            columns.push(field);
        }
        columns = '(' + columns.join() +')';
        this.contentAQI.map(record => {
            var values = [];
            for(field in record) {
                if( record[field] ) {
                    values.push(record[field]);
                } else values.push('NULL');    
            }
            values = '(' + values.join() + ')';
            fields.push(values);
        })
        fields = fields.join();
        console.log(fields);
        var sql = "INSERT INTO sparc_aqi "+ columns +" VALUES " + fields;
        if (connectStatus === 'idle') {
            connectStatus = 'busy';
            con.query(sql, function (err, result) {
                if (err) throw err;
                connectStatus = 'idle'
                self.clearMemory();
            });
        } else {
            var saveInterval = setInterval(function () {
                if (connectStatus === 'idle') {
                    connectStatus = 'busy';
                    con.query(sql, function (err, result) {
                        if (err) throw err;
                        connectStatus = 'idle'
                        self.clearMemory();
                    });
                    clearInterval(saveInterval);
                }
            }, 1000)
        }
    }
    saveAverageData() {
        var self = this;
        this.status = 'pending';
        var columns = [], fields = [];
        for(var field in config.average_fields) {
            columns.push(field);
        }
        columns = '(' + columns.join() +')';
        this.contentAQI.map(record => {
            var values = [];
            for(field in record) {
                if( record[field] ) {
                    values.push(record[field]);
                } else values.push('NULL');    
            }
            values = '(' + values.join() + ')';
            fields.push(values);
        })
        fields = fields.join();
        console.log(fields);
        var sql = "INSERT INTO sparc_aqi "+ columns +" VALUES " + fields;
        if (connectStatus === 'idle') {
            connectStatus = 'busy';
            con.query(sql, function (err, result) {
                if (err) throw err;
                connectStatus = 'idle'
                self.clearMemory();
            });
        } else {
            var saveInterval = setInterval(function () {
                if (connectStatus === 'idle') {
                    connectStatus = 'busy';
                    con.query(sql, function (err, result) {
                        if (err) throw err;
                        connectStatus = 'idle'
                        self.clearMemory();
                    });
                    clearInterval(saveInterval);
                }
            }, 1000)
        }
    }
}