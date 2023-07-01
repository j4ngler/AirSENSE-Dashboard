"use strict";

const data = require("../config/data.config");
const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const { writeClient } = require("../config/data.config");
class BlockMemory {
  constructor() {
    this.status = "available";
    this.memory = [];
    this.valuesSetup = [];
  }

  setup(value) {
    this.valuesSetup = value;
  }

  add(record) {
    // console.log(record)
    this.memory.push(record);
    try {
      if (this.isFull()) this.saveAll();
    } catch {}
  }

  isFull() {
    return this.memory.length >= 6;
  }

  isAvailable() {
    return !(this.status == "pending");
  }

  clearMemory() {
    this.memory = [];
  }

  async writeData(datas) {
    return new Promise(async (resolve, reject) => {
      try {
        datas.forEach((data) => {
          const content = data.content;
          console.log(data);
          const point = new Point("sensorAir")
            .tag("topic", data.topic)
            .floatField("PM2p5", content.PM2p5 || 0)
            .floatField("PM10", content.PM10 || 0)
            .floatField("PM1", content.PM1 || 0)
            .floatField("Humidity", content.Humidity || 0)
            .floatField("Temperature", content.Temperature || 0)
            .floatField("Pressure", content.Pressure || 0)
            .floatField("SO2", content.SO2 || 0)
            .floatField("NO2", content.NO2 || 0)
            .floatField("CO2", content.CO2 || 0)
            .floatField("CO", content.CO || 0)
            .floatField("O3", content.O3 || 0)
            .floatField("NO2W", content.NO2W || 0)
            .floatField("O3W", content.O3W || 0)
            .floatField("COW", content.COW || 0)
            .floatField("COA", content.COA || 0)
            .floatField("SO2W", content.SO2W || 0)
            .floatField("SO2A", content.SO2A || 0);

          // Ghi điểm dữ liệu vào write client
          writeClient.writePoint(point);
        });

        // Gửi dữ liệu từ buffer vào InfluxDB
        await writeClient.flush();

        // Đóng kết nối write client
        writeClient.close();

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async saveAll() {
    let self = this;
    this.status = "pending";
    if (this.memory.length > 0) {
      console.log("Save data station");
      await this.writeData(this.memory)
        .then(() => {
          self.status = "idle";
          self.clearMemory();
          console.log("Dữ liệu đã được ghi thành công.");
        })
        .catch((err) => {
          console.error("Lỗi khi ghi dữ liệu:", err);
        });
    } else {
      self.status = "idle";
      self.clearMemory();
    }
  }
}

module.exports = BlockMemory;
