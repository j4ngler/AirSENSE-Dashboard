const {CronJob: cronJob} = require('cron');
const {appConstant} = require('./constant');
const BlockMemory = require('./model/blockMemory.js');
const mongoose = require('mongoose');
const mongoConfig = require('./config/configMongo');



// Connecting to the database
mongoose.connect(mongoConfig.dbConfig,{user: mongoConfig.username, pass: mongoConfig.password, useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
});


var SaveFactory = (function(){
    class Save {
        constructor() {
            this.memo = new BlockMemory();
        }
    
        updateHourly() {
            if (this.memo.isAvailable()) {           
            this.memo.updateHourly();
            }

            else {
                console.log('An error occured, please check the system');
            }
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


var task = SaveFactory.getInstance();



new cronJob(appConstant.EVERY_HOUR, 
    async () => {
    console.log('=========================Hourly view update started=======================')
    try {
        task.updateHourly();            
    }
    catch (e) {
        console.log('update hourly error ' , e)
    }
    console.log('=========================Hourly view update finished======================')
},
null,   //when job strp
true,    //auto start
'Asia/Ho_Chi_Minh'
)