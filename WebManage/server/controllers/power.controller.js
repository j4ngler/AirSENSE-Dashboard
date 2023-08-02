
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
const PowerSensor = require('../models/schemaMongo/powerSensor.js');
const {mqttMessage} = require("../utils/mqttMessage.js");


var aqiManager = new AQIManager();
const Excel = require('exceljs');
var reportManager= new ReportManager();
var powerCtrl={};



powerCtrl.getAllStation = function(request, response) {
    //if (request.currentUser.manifestid < 4) {
        const station_data = request.body;
        // console.log('data', station_data);
        // console.log("type_station_id", 2)
        var tableSelect = mangerModelAdmin("device_sensor");
        var dataTableSQL=tableSelect.getSQLReport(2);
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

 

powerCtrl.getDataStation = async (req, res) => {
  const { stationID, fromTime, toTime } = req.body;
  console.log(fromTime, toTime, stationID);
  const stationSelect = stationID;
  console.log(new Date());
  const result = await PowerSensor.find(
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


powerCtrl.getReportStations = async function(request, response) {
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

  const result = await PowerSensor.find({"content": {$exists:true}, "topic": station_id, $and: [ { "time": {$gt: convertFromTime}}, { "time": {$lt: convertToTime} }]});

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
          { header: 'Voltage', key: 'Voltage', width: 20 },
          { header: 'Current', key: 'Current', width: 20 },
          { header: 'Power', key: 'Power', width: 20 },
          { header: 'Energy', key: 'Energy', width: 20 },
          { header: 'Frequency', key: 'Frequency', width: 20 },
          { header: 'Power_Factor', key: 'Power_Factor', width: 20 }
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
              Voltage: record.content.Voltage ? record.content.Voltage : 'NULL' , 
              Current: record.content.Current ? record.content.Current : 'NULL', 
              Power: record.content.Power ? record.content.Power : 'NULL', 
              Energy: record.content.Energy ? record.content.Energy : 'NULL', 
              Frequency: record.content.Frequency ? record.content.Frequency : 'NULL',
              Power_Factor: record.content.Power_Factor ? record.content.Power_Factor : 'NULL',
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



module.exports = powerCtrl;
