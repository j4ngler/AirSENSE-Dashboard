
const isAuthenticatedAll = require("../middlewares/authenticateAll");
const deleteDataTime = require("../models/database/deleteDataTime.model");

module.exports = (req, res, next) =>  {

    const { station_id, fromTime } = req.body;

    // //check station id
    // const station_id = deleteData.getStationId();
    // console.log('id tram',station_id);

    //thoi gian hien tai
    var currentTime = Date.now();

    //in ra timestamp cua fromTime va currentime
    console.log('time hien tai', currentTime);
    console.log('time bat dau', fromTime);


    //quy doi timestamp ra thang
    var timeDifference = (currentTime - fromTime);
    var dayDifference = timeDifference/(1000*60*60*24);
    var monthDifference = dayDifference/30;


    if(isAuthenticatedAll) {
        console.log('Account logined');
        next();
    }
    else {
        if(monthDifference <= 3) {
            console.log('Accepted time');
            next();
        } else {
            console.log('Time must not over 3 months');
            return; 
        }
    }

}
