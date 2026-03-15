
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
const ShrimpLakeSensor = require('../models/schemaMongo/shrimpLakeSensor.js');
const {mqttMessage} = require("../utils/mqttMessage.js");


var aqiManager = new AQIManager();
const Excel = require('exceljs');
var reportManager= new ReportManager();
var shrimpLakeCtrl={};



shrimpLakeCtrl.getAllStation = function(request, response) {
    //if (request.currentUser.manifestid < 4) {
        const station_data = request.body;
        // console.log('data', station_data);
        // console.log("type_station_id", 2)
        var tableSelect = mangerModelAdmin("device_sensor");
        var dataTableSQL=tableSelect.getSQLReport(3);
        //var itemSelect=tableSelect.getValueToSelectToFind(req.body.dataFind); 
        // console.log(dataTableSQL); 
        knex.raw(dataTableSQL)
        .then(result => {
            console.log("get data sensor ok");
            return returnOK(response,result[0]);
        }
        , error => {
            console.log("get data sensor failed");

            return returnNotFound(response,error);
        });
   // }
   // else {
   //     return response.send(JSON.stringify({ logout: true }));
    //}
};

 

shrimpLakeCtrl.getDataStation = async (req, res) => {
  const { stationID, fromTime, toTime } = req.body;
  console.log(fromTime, toTime, stationID);
  const stationSelect = stationID;
  console.log(new Date());
  const result = await ShrimpLakeSensor.find(
    {
      content: { $exists: true },
      topic: stationSelect,
      $and: [{ time: { $gt: fromTime } }, { time: { $lt: toTime } }],
    },
    { _id: 0, __v: 0, topic: 0 }
  )
    // .hint({ time: 1 })
    .lean();
    // console.log(new Date());
//   console.log(JSON.stringify(result));
    res.send(JSON.stringify({
        station: stationID,
        data: result
    }));
};

shrimpLakeCtrl.getReportStations = async function(request, response) {
  // console.log("abc",request.body)
  let fromTime = request.body.fromTime;
  let toTime = request.body.toTime;
  let station_id = request.body.station_id;
  let convertFromTime = request.body.getFromTime;
  let convertToTime =  request.body.getToTime;
  let stationTitle = 'rell';
  let stationMAC = '';

  // console.log('abc', station_id)
  // mqttMessage(station_id, convertFromTime, convertToTime);

  reportManager.getStation(station_id).then(function(station) {
      stationTitle = station[0].title;
      stationMAC = station[0].mac
  })
  .catch((error) => {
    console.log(error)
      stationTitle = 'No Information';
      stationMAC = 'None'
  })

  const result = await ShrimpLakeSensor.find({"content": {$exists:true}, "topic": station_id, $and: [ { "time": {$gt: convertFromTime}}, { "time": {$lt: convertToTime} }]});
  console.log(result);
  if(!!result) {
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
          { header: 'Thời gian', key: 'Date', width: 20 },
          { header: 'Timestamp', key: 'Time', width: 20 },
          { header: 'ecSensor_value', key: 'ecSensor_value', width: 20 },
          { header: 'phSensor_value', key: 'phSensor_value', width: 20 },
          { header: 'doSensor_value', key: 'doSensor_value', width: 20 },
          { header: 'temperature', key: 'temperature', width: 20 },
          { header: 'ecSensor_mv', key: 'ecSensor_mv', width: 20 },
          { header: 'phSensor_mv', key: 'phSensor_mv', width: 20 },
          { header: 'doSensor_mv', key: 'doSensor_mv', width: 20 }
      ];
      // const resultReal = result[0];
      for (let i = 0; i < result.length; i++) {
          let record = result[i];
          // console.log(record)
          let d = new Date((record.time) * 1000);
          let date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':00';
          worksheet.addRow({
              Date: date, 
              Time: record.time, 
              station_id: stationMAC,
              station_title: stationTitle,
              ecSensor_value: record.content.ecSensor_value ? record.content.ecSensor_value : 'NULL' , 
              phSensor_value: record.content.phSensor_value ? record.content.phSensor_value : 'NULL', 
              doSensor_value: record.content.doSensor_value ? record.content.doSensor_value : 'NULL' , 
              temperature: record.content.temperature_value ? record.content.temperature_value : 'NULL', 
              ecSensor_mv: record.content.ecSensor_mv ? record.content.ecSensor_mv : 'NULL', 
              phSensor_mv: record.content.phSensor_mv ? record.content.phSensor_mv : 'NULL',
              doSensor_mv: record.content.doSensor_mv ? record.content.doSensor_mv : 'NULL',
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

  }
  else {
     return response.send("false"); 
    }


// return response.send(JSON.stringify({ logout: true }));

}



module.exports = shrimpLakeCtrl;
