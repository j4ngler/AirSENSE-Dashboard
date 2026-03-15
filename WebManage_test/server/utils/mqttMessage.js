const mqtt = require('mqtt');
require('dotenv').config();

const topic = 'myTopic/2';
const payload = {
  station_id: '12345',
  convertFromTime: 222222,
  convertToTime: 444444
}

//connect to mqtt broker
var clients = []
const mqttConfig = require('../config/default.json').mqtt;
mqttConfig.map(config => {
  config.clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
  var client = mqtt.connect(process.env.APP_MQTT, config);
  clients.push(client);

  client.on('connect', function () {

    //subcribe topic 2
    client.subscribe(topic, function () {
      console.log('Mqtt connected');
      // publish message
      client.publish(topic, JSON.stringify(payload), { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
        }
      });
    });
  });
});

// clients.map(client => {
//   client.on('message', function (topic, message, packet) {
//     message = JSON.parse(message.toString('utf-8'));
//     console.log(message);
//   })
// })

