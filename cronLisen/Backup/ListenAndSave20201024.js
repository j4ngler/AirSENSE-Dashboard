var mqtt = require('mqtt')
var events = require('events');
emitter = new events.EventEmitter();

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    database: "admin_python",
    user: "sparclab",
    password: "LabSPARC",

    // host: "localhost",
    // database: "test",
    // user: "root",
    // password: "",
});

var config = {
    maxItemMemory: 20
}

var connectStatus = 'idle';

class BlockMemory {
    constructor() {
        this.status = 'available'
        this.memory = [];
    }

    add(record) {
        if (!this.isFull()) {
            this.memory.push(record);
            if (this.isFull()) this.saveAll();
        } else {
            console.log('full memory');
            console.log('memory: ', this.memory);
        }
    }

    isFull() {
        return this.memory.length === config.maxItemMemory;
    }

    isAvailable() {
        return !(this.isFull() || this.status == 'pending');
    }

    clearMemory() {
        this.memory = []
    }

    saveAll() {
        var self = this;
        this.status = 'pending';
        var sql = "INSERT INTO sparc_sensor_data (station_id,Time,PM2p5,PM10,PM1,Temperature,Humidity) VALUES ";
        var data = this.memory.join();
        sql += data;
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


class Save {
    constructor() {
        this.memFirst = new BlockMemory();
        this.memSecond = new BlockMemory();
    }

    save(record) {
        if (this.memFirst.isAvailable()) {
            this.memFirst.add(record);
        } else this.memSecond.add(record);
    }
}


var options = {
    port: 1883,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'sparc',
    useNewUrlParser: true,
    password: 'sparcXZAairsenseATU',
};

var client = mqtt.connect('http://mqtt.airsense.vn/', options);
client.on('connect', function () {
    client.subscribe('#', function (err) {
        if (!err) {
            console.log("allll.....ok client");
        }
        else
            console.log(err);
    })
})

var save = new Save();

client.on('message', function (topic, message, packet) {
    try{
        message = JSON.parse(message.toString('utf-8'));
        var stationId = message.NodeId;
        stationId = parseInt(stationId, 16);
        var Time = message.DATA.Time;
        var PM2p5 = message.DATA.Pm2p5;
        var PM10 = message.DATA.Pm10;
        var PM1 = message.DATA.Pm1;
        var Temperature = message.DATA.Tem;
        var Humidity = message.DATA.Hum;
        var record = [stationId, Time, PM2p5, PM10, PM1, Temperature, Humidity];
        console.log('{'+record.join()+'}');
        record = ' (' + record.join() + ') ';
        save.save(record);
    } catch(e) {
        console.log("Excaption: ",e);
        console.log("Message: ",message.toString());
    }
});



