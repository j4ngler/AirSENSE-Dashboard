const mqtt = require('mqtt')
const events = require('events')
emitter = new events.EventEmitter()
const config = require('./config/default.json')
var data = require('./config/data.config')
const mongoose = require('mongoose')
const mongoConfig = require('./config/mongoConfig.js')
const BlockMemory = require('./models/BlockMemory')
require('dotenv').config()
const cron = require('node-cron')
// Connecting to the database
mongoose
  .connect(mongoConfig.dbConfig, {
    user: mongoConfig.username,
    pass: mongoConfig.password,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Successfully connected to the database')
  })
  .catch(err => {
    console.log('Could not connect to the database. Exiting now...', err)
  })

var SaveFactory = (function () {
  class Save {
    constructor () {
      this.memFirst = new BlockMemory()
      this.memSecond = new BlockMemory()
    }

    save (record) {
      if (this.memFirst.isAvailable()) {
        this.memFirst.add(record)
      } else this.memSecond.add(record)
    }
  }

  var instance
  return {
    getInstance: function () {
      if (!instance) {
        instance = new Save()
        delete instance.constructor
      }
      return instance
    }
  }
})()

var clients = []
const mqttConfig = require('./config/default.json').mqtt
mqttConfig.map(config => {
  config.clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)
  var client = mqtt.connect(process.env.APP_MQTT, config)
  clients.push(client)
  client.on('connect', function () {
    console.log(config.port)
    client.subscribe('#', function (err) {
      // console.log(config.port)
      if (!err) {
        console.log('Connect mqtt successfully in port:', config.port)
      } else console.log(err)
    })
  })
})

var save = SaveFactory.getInstance()

clients.map(client => {
  client.on('message', function (topic, message, packet) {
    try {
      message = JSON.parse(message.toString('utf-8'))
      console.log(message)
      // giang changes init
      var current = +new Date()
      current /= 1000
      message.Time = message.Time - 7 * 60 * 60
      if (
        message.Time < current + 24 * 60 * 3600 &&
        message.station_id != null &&
        message.station_id != ''
      ) {
        let stationID = parseInt(message.station_id, 16)
        var infoSave = {
          topic: 'sensor/' + stationID,
          time: message.Time,
          content: {
            PM2p5: message.PM2p5,
            PM10: message.PM10,
            PM1: message.PM1,
            Temperature: message.Temperature,
            Humidity: message.Humidity,
            Pressure: message.Pressure,
            SO2: message.SO2,
            NO2: message.NO2,
            CO2: message.CO2,
            CO: message.CO,
            O3: message.O3,
            NO2W: message.NO2W,
            NO2A: message.NO2A,
            O3W: message.O3W,
            O3A: message.O3A,
            COW: message.COW,
            COA: message.COA,
            SO2W: message.SO2W,
            SO2A: message.SO2A
          }
        }
      }
      console.log(infoSave);

      save.save(infoSave)
    } catch (e) {}
  })
})

// delete data
const task = cron.schedule('0 0 0 * * *', async () => {
  console.log('Cron job chạy vào lúc 12:00AM mỗi ngày!')
  var current = +new Date()
  current = Math.floor(current / 1000)
  const dataGet = await data.findOne().sort('time').exec()
  const fromTimeDelete = dataGet.time
  const toTimeDelete = fromTimeDelete + 24 * 3600
  console.log(fromTimeDelete)
  const dataDelete = await data
    .deleteMany({
      time: { $gte: fromTimeDelete },
      time: { $lte: toTimeDelete }
    })
    .exec()
  if (dataDelete && dataDelete.acknowledged === true) {
    console.log('Đã xóa', dataDelete.deletedCount, 'bản ghi')
  }
})
