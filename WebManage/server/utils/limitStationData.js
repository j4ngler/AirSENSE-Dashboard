
const isAuthenticatedAll = require("../middlewares/authenticateAll");
const deleteDataTime = require("../models/database/deleteDataTime.model");


module.exports = (req, res, next) =>  {

    const deleteData = new deleteDataTime();
    const stationIdRequest = req.body;

    const tableData = deleteData.getStationData();
    console.log('check data 2', tableData[0]);

    // //check station id
    // const station_id = deleteData.getStationId();
    // console.log('id tram',station_id);

    //thoi gian hien tai
    var currentTime = Date.now();

    // //thoi gian bat dau lay du lieu
    // const getFromTime = deleteData.getTimeStamp();
    // // var fromTime = getFromTime.getTime();


    // //in ra timestamp cua fromTime va currentime
    // console.log('time hien tai', currentTime);
    // console.log('time bat dau', getFromTime);


    // //quy doi timestamp ra thang
    // var timeDifference = (currentTime - fromTime);
    // var dayDifference = timeDifference/(1000*60*60*24);
    // var monthDifference = dayDifference/30;

    // if(stationIdRequest == station_id && monthDifference <= 3) {
    //     console.log("Accepted time");
    //     next();
    // }
    // else {
    //     if(isAuthenticatedAll) {
    //         res.json({})
    //         next();
    //     } else {
    //         console.log("Over 3 months");
    //         return;
    //     } 
    // }

    next();
}
