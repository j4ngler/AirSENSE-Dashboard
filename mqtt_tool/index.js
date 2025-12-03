const mqtt = require("mqtt");
const { CronJob: cronJob } = require("cron");
const { appConstant } = require("./constant");
require("dotenv").config();


const host = process.env.MQTT_BROKER_URL;
const port = process.env.MQTT_BROKER_PORT;
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
  reconnectPeriod: 1000,
});

client.on("connect", () => {
  console.log("Connected");
  //   client.subscribe([topic], () => {
  //     console.log(`Subscribe to topic '${topic}'`)
  //   })

  // client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
  //   if (error) {
  //     console.error(error)
  //   }
  // })
  client.subscribe("myTopic/1", (error) => {
    if (error) console.log(error);
    console.log("Client subcribe to myTopic/1");
    new cronJob(
      appConstant.EVERY_10S,
      function () {
        console.log("==job 10s start==");
        let stationId = 686868;
        for(let i = 0; i < 10; ++i) {
        let tempStation = stationId + i;
        let convertedTempStation = tempStation.toString();
        const time = new Date();
        const timeStamp = Math.floor(time.getTime() / 1000);
        client.publish(
          convertedTempStation,
          JSON.stringify({
            station_id: convertedTempStation,
            Time: timeStamp,
            CO: Math.random() * 50400,
            O3: Math.random() * 604,
            SO2: Math.random() * 1004,
            NO2: Math.random() * 2049,
            PM10: Math.random() * 604,
            PM1: Math.random() * 654,
            PM2p5: Math.random() * 500.4,
            Humidity: Math.random() * 100,
            Temperature: Math.random() * 40,
            Pressure: 100000 + Math.random() * 1000,
          }),
          { qos: 2 },
          (error) => {
            if (!error) {
              res.status(200).json({ msg: "Send message successfully" });
            } else {
              console.log(error);
              res
                .status(500)
                .json({ msg: "Failure , please send message again" });
            }
          }
        );
      }
      },
      null, // cb when job stop
      true, // auto start
      "Asia/Ho_Chi_Minh"
    );
  });
});

// client.on('message', (topic, payload) => {
//   console.log('Received Message:', topic, payload.toString())
// })
