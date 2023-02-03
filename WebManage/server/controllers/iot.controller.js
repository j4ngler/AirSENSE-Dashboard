
const bcrypt = require('bcrypt');
const HttpStatus = require('http-status-codes');
const knex = require('../config/knex.js');
var squel = require("squel");
const TableManifest= require('../models/middlewareDatabase/TableManifest.js');
const mangerModel = require('../models/database/managerAll.model.js');
const {returnOK,returnFalse,returnNotFound } = require('../utils/returnResponse.js');
const {getRamdomData} = require('../utils/utilsString.js');
const {mangerModelAdmin} = require('../models/database/managerAll.model.js');
const ReportManager = require("../models/manager/ReportManager.js");
const AQIManager = require("../models/manager/AQIManager");
const DataSensor = require('../models/schemaMongo/dataSensor');

var aqiManager = new AQIManager();
const Excel = require('exceljs');
var reportManager= new ReportManager();
var iotCtrl={};
 

                          
iotCtrl.checkEmailRegister =async function (req, res) {
  
  try
  {
    var tableSelect=mangerModel('customer');
    var checkCustomer = squel.select().from('customer')
                        .where("email='"+req.body["email"]+"'")
                        .where("deleteflag=0");
    var dataCustomer = await  knex.raw(checkCustomer.toString());
    var empyUser=false;

    if ((dataCustomer==null)||(dataCustomer[0].length==0)) {
        empyUser=true;
        dataCustomer = await  knex.raw(tableSelect.addFormToTableSQL(req.body));
        if ((dataCustomer==null)||(dataCustomer[0].length==0)){
            returnFalse(res,"Database inval");
            return;
        }
    }
    tableSelect=mangerModel('mqtt_user');
    var dataIport = {};
    var nameEmail =req.body["email"].split('@');
    console.log(dataCustomer[0][0].email);
    dataIport["mqtt_user_id"]=0;
    dataIport["user_id"]=dataCustomer[0][0].customer_id;
    dataIport["content"]=nameEmail[0];
    dataIport["mqtt_pub"]='p_'+nameEmail[0];
    dataIport["mqtt_sub"]='s_'+nameEmail[0];
    dataIport["mqtt_user"]=nameEmail[0];
    dataIport["mqtt_pass"]=getRamdomData(10);
    dataIport["mqtt_id"]=nameEmail[0];
    console.log(empyUser);
    if(empyUser){
        dataCustomer = await  knex.raw(tableSelect.addFormToTableSQL(dataIport));
        returnOK(res,dataIport);
    }
    else
    {
        var chechMQTT = squel.select().from('mqtt_user')
                        .where("user_id="+dataCustomer[0][0].customer_id+"")
                        .where("deleteflag=0");
                        console.log(chechMQTT.toString());
        var dataMqttUser = await  knex.raw(chechMQTT.toString());                
        if ((dataMqttUser==null)||(dataMqttUser[0].length==0)){
            dataMqttUser = await  knex.raw(tableSelect.addFormToTableSQL(dataIport));
            returnOK(res,dataIport);
        }
        else
        {
            returnOK(res,dataMqttUser[0][0]);
        }

    }    
  }
  catch(ie){
      console.log(ie);
    returnFalse(res,ie.toString());
  } 
}

iotCtrl.getThreshhold = function(request, response) {
    reportManager.getThreshholdIndex().then(function(result){
        return response.send(JSON.stringify(result[0]));
    });
};

iotCtrl.reportDataSensor = function(request, response) {
    var data = request.body["data"];
    console.log(" data .............request.body.....",request.body);
    var fromTime = request.body["fromTime"];
    var toTime = request.body["toTime"];
    var now = new Date().getTime()/1000;
    if(fromTime != undefined || now-fromTime>3*24*60*60) fromTime = now - 3*24*60*60;
    if(toTime!=undefined || toTime>now) toTime = now;
    if (data.includes(",")) {
        var listItem = data.split(",");
        reportManager.getDataForChart(fromTime, toTime, result1).then(function (result2) {
            return response.send(JSON.stringify(result2[0]));
        }).catch(function (err1) { return response.send("false"); });

    } else {
        var listItem = [];
        listItem.push(data);
        reportManager.getDataForChart(fromTime, toTime, data).then(function (result2) {
            return response.send(JSON.stringify(result2[0]));
        }).catch(function (err1) { return response.send("false"); });
    }
};

iotCtrl.getStationServer = function(request, response) {
    console.log("request.currentUser",request.currentUser);
    if (request.currentUser.manifestid < 4) {
        var tableSelect = mangerModelAdmin("sparc_location_sensor");
        //var itemSelect=tableSelect.getValueToSelectToFind(req.body.dataFind);
        var dataTableSQL=tableSelect.getSQLReport(request.currentUser);
        knex.raw(dataTableSQL)
        .then(result => {
            return response.send(JSON.stringify({result:result[0]}));
        }
        , error => {
            return returnNotFound(response,error);
        });
    }
    else {
        return response.send(JSON.stringify({ logout: true }));
    }
};

iotCtrl.getStationHome = function(request, response) {
    //if (request.currentUser.manifestid < 4) {
        var tableSelect = mangerModelAdmin("device_sensor");
        var dataTableSQL=tableSelect.getSQLReport(request.currentUser);
        //var itemSelect=tableSelect.getValueToSelectToFind(req.body.dataFind);  
        knex.raw(dataTableSQL)
        .then(result => {
            return returnOK(response,result[0]);
        }
        , error => {
            return returnNotFound(response,error);
        });
   // }
   // else {
   //     return response.send(JSON.stringify({ logout: true }));
    //}
};

iotCtrl.reportDataStationLimit = function(request, response) {
    var dataTableSQL= 'SELECT * FROM `sparc_sensor_data`  ORDER BY Time DESC LIMIT '+request.body["data"];
    knex.raw(dataTableSQL)
    .then(result => {
        return returnOK(response,result[0]);
    }
    , error => {
        return returnNotFound(response,error);
    });
};

iotCtrl.getReportStations = function(request, response) {
            console.log(request.body)
            let fromTime = request.body.fromTime;
            let toTime = request.body.toTime;
            let station_id = request.body.station_id;
            let convertFromTime = request.body.getFromTime;
            let convertToTime =  request.body.getToTime;
            let stationTitle = 'rell';
            let stationMAC = '';
            reportManager.getStation(station_id).then(function(station) {
                stationTitle = station[0].title;
                stationMAC = station[0].mac
            })
            .catch((error) => {
                stationTitle = 'No Information';
                stationMAC = 'None'
            })
            reportManager.getReportStations(convertFromTime, convertToTime, station_id).then(function (result) {
            // console.log(stationTitle);
                // console.log(result);
                var workbook = new Excel.Workbook();
                workbook.views = [
                    {
                        x: 0, y: 0, width: 10000, height: 20000,
                        firstSheet: 0, activeTab: 1, visibility: 'visible'
                    }
                ]

                var worksheet = workbook.addWorksheet(stationTitle);
                worksheet.columns = [
                    { header: 'Mã trạm', key: 'station_id', width: 10 },
                    { header: 'Tên trạm', key: 'station_title', width: 30},
                    { header: 'Thời gian', key: 'Date', width: 10 },
                    { header: 'Timestamp', key: 'Time', width: 10 },
                    { header: 'PM2p5', key: 'PM2p5', width: 10 },
                    { header: 'PM10', key: 'PM10', width: 10 },
                    { header: 'PM1', key: 'PM1', width: 10 },
                    { header: 'Temperature', key: 'Temperature', width: 10 },
                    { header: 'Humidity', key: 'Humidity', width: 10 },
                    { header: 'Pressure', key: 'Pressure', width: 10 },
                    { header: 'NO2W', key: 'NO2W', width: 10 },
                    { header: 'NO2A', key: 'NO2A', width: 10 },
                    { header: 'O3W', key: 'O3W', width: 10 },
                    { header: 'O3A', key: 'O3A', width: 10 },
                    { header: 'COW', key: 'COW', width: 10 },
                    { header: 'COA', key: 'COA', width: 10 },
                    { header: 'SO2W', key: 'SO2W', width: 10 },
                    { header: 'SO2A', key: 'SO2A', width: 10 },
                ];
                // const resultReal = result[0];
                for (let i = 0; i < result.length; i++) {
                    let record = result[i];
                    console.log(record)
                    let d = new Date((record.time) * 1000);
                    let date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':00';
                    worksheet.addRow({
                        Date: date, 
                        Time: record.time, 
                        station_id: stationMAC,
                        station_title: stationTitle,
                        PM2p5: record.content.PM2p5 ? record.content.PM2p5 : 'NULL' , 
                        PM10: record.content.PM10 ? record.content.PM10 : 'NULL', 
                        PM1: record.content.PM1 ? record.content.PM1 : 'NULL', 
                        Temperature: record.content.Temperature ? record.content.Temperature : 'NULL', 
                        Humidity: record.content.Humidity ? record.content.Humidity : 'NULL',
                        Pressure: record.content.Pressure ? record.content.Pressure : 'NULL',
                        NO2W: record.content.NO2W ? record.content.NO2W : 'NULL',
                        NO2A: record.content.NO2A  ? record.content.NO2A : 'NULL',
                        O3W: record.content.O3W ? record.content.O3W : 'NULL',
                        O3A: record.content.O3A ? record.content.O3A : 'NULL',
                        COW: record.content.COW ? record.content.COW : 'NULL',
                        COA: record.content.COA ? record.content.COA : 'NULL',
                        SO2W: record.content.SO2W ? record.content.SO2W  : 'NULL',
                        SO2A: record.content.SO2A ?  record.content.SO2A  : 'NULL'
                    });
                }

                // reportManager.getStation(station_id).then(function(station) {
                    let from = reportManager.formatDate(new Date(convertFromTime * 1000));
                    let fileName = "";
                    if(toTime!=undefined) {
                        let to = reportManager.formatDate(new Date(convertToTime * 1000));
                        fileName = stationTitle+'_'+from+'_'+to+'.xlsx';
                    } 
                    else 
                    fileName = stationTitle+'_'+from+'.xlsx';

                    let filePath = './public/file/'+fileName;
                    console.log(filePath);
                    const responseData = {
                        filePath: filePath,
                        data: result
                    };
                    // console.log(responData);


                    workbook.xlsx.writeFile(filePath).then(function () {
                    //     // console.log(JSON.stringify(responData));
                    //     console.log(filePath);
                        return response.send(JSON.stringify(responseData));
                    //     // return response.send(JSON.stringify({ fileExcel: filePath }));
                    });
                // });

            })
            .catch(function (err1) { return response.send("false"); });
    
    
        // return response.send(JSON.stringify({ logout: true }));
     
}


iotCtrl.getAbnormalData = function(request, response) {
    reportManager.getAbnormalData().then(function (result) {
        return response.send(JSON.stringify(result));
    });
};


iotCtrl.getCurrentAQI= function(request, response) {
    aqiManager.getCurrentAQIFromDb().then((stations)=> {
        response.send(JSON.stringify(stations[0]));
    }) 
};
iotCtrl.getAqiData= function(request, response) {
    var stationId = request.body.stationId;
    aqiManager.getAqiData(stationId).then((result)=> {
        console.log('result', result)
        response.send(JSON.stringify(result[0]));
    }) 
};
iotCtrl.getDataRecent= function(request, response) {
    var stationId = request.body["stationId"];
    aqiManager.getFielDataRecent(stationId).then((result)=> {
        response.send(JSON.stringify(result));
    }) 
};


iotCtrl.getDataStation = async (req, res) => {
    const { stationID, fromTime, toTime } = req.body;
    console.log(fromTime, toTime, stationID);
    const stationSelect = 'sensor/'+stationID;

    const result = await DataSensor.find({"content": {$exists:true}, "topic": stationSelect, $and: [ { "time": {$gt: fromTime}}, { "time": {$lt: toTime} }]});
    // console.log(result);
    res.send(JSON.stringify(result))
}



module.exports = iotCtrl;
