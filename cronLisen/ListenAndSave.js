var mqtt = require('mqtt')
var events = require('events');
emitter = new events.EventEmitter();
const config = require('./config/default.json');
var mysql = require('mysql');

var con = mysql.createConnection(config.database);

var connectStatus = 'idle';

class BlockMemory {
    constructor() {
        this.status = 'available'
        this.memory = [];
    }

    add(record) {
        this.memory.push(record);
        try{
            if (this.isFull()) this.saveAll();
        }catch(e){}
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
        var columns = [], fields = [];
        for(var field in config.fields) {
            columns.push(field);
        }
        columns = '(' + columns.join() +')';
        this.memory.map(record => {
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
        var sql = "INSERT INTO sparc_sensor_data "+ columns +" VALUES " + fields;
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

var SaveFactory = (function(){
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

    var instance;
    return {
        getInstance: function(){
        if (!instance) {
            instance = new Save();
            delete instance.constructor;
        }
        return instance;
        }
    };
})();


var mqttConfig = config.mqtt;
var clients = [];
mqttConfig.map(config => {
    config.clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
    var client = mqtt.connect('mqtt://103.1.238.175/', config);
    clients.push(client);
    client.on('connect', function () {
        console.log(config.port)
        client.subscribe('/V3/3c610511', function (err) {
            // console.log(config.port)
            if (!err) {
                console.log("Connect mqtt successfully in port:", config.port);
            }
            else
                console.log(err);
        })
    })
})


var save = SaveFactory.getInstance();

clients.map(client => {
    console.log('hello');
    client.on('message', function (topic, message, packet) {
        try{
            message = JSON.parse(message.toString('utf-8'));
            // console.log(message);
            var record = Object.assign({}, config.fields);
            for(property in record) {
                if(message[property] != undefined) {
                    record[property] = message[property];
                }
            }
            var current = + new Date();
            console.log(current);
            current = current/1000;
            //bo qua ban ghi co thoi gian lon hon thoi gian hien tai 24h
            record.Time = record.Time - 7*60*60;
            if(record.Time>(current+24*60*3600)) {
                return;
            }
            // console.log(message)
            if(message.station_id!=null && message.station_id != '' ) {
                record.station_id = parseInt(message.station_id, 16);
                console.log('ok',record);
                save.save(record);
            }
        } catch(e) {
        }
    });
})



