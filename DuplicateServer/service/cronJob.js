const {CronJob: cronJob} = require("cron");
const cronInstance  = require('../config/cronConstant');
const BlockMemory = require('../model/BlockMemory.js');

let instance = new BlockMemory();


new cronJob(
    cronInstance.EVERY_10S,
    async function () {
        console.log('Hello Giang');
        try {
            instance.setCount(5);
            await instance.getLatch();
        }
        catch(error) {
            console.log('error......', error);
        }

    },
    null,  // cb when job stop
    true,  // auto start
    'Asia/Ho_Chi_Minh'
)
