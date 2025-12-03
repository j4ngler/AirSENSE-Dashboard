const {CronJob: cronJob} = require("cron");
const {appConstant} = require("../constant");
const blockMemory = require("../model/blockMem.model");

new cronJob(
    appConstant.EVERY_1MINUTE,
    function () {
        console.log('==job 10s start==')
        if (!blockMemory.isNull()) {
            console.log('=======================Inserting data into MongoDB======================')
            blockMemory.saveAll()
            blockMemory.clearMemory()
            console.log('=================Inserting finished, block memory cleared===============')
        }
    },
    null,  // cb when job stop
    true,  // auto start
    'Asia/Ho_Chi_Minh'
)

 new cronJob(
    appConstant.EVERY_HOUR,
    async () => {
        console.log('=========================Hourly view update started=======================')
        try{
            await blockMemory.updateHourly()
        }catch (e) {
            console.log('update hourly error ' , e)
        }
        console.log('=========================Hourly view update finished======================')
    },
    null,
    true,
    'Asia/Ho_Chi_Minh'
)

new cronJob(
    appConstant.EVERY_6HOUR,
    async () => {
        console.log('==========================Daily view update started=======================')
        try{
            await blockMemory.updateDaily()
        }catch (e) {
            console.log('update hourly error ' , e)
        }
        console.log('==========================Daily view update finished======================')
    },
    null,
    true,
    'Asia/Ho_Chi_Minh'
)
