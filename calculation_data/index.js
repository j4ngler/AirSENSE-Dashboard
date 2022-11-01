var events = require('events');
emitter = new events.EventEmitter();
const config = require('./config/default.json');
var mysql = require('mysql');

var con = mysql.createConnection(config.database);




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



