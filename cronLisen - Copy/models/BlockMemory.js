"use strict";

const data = require("../config/data.config");
const { writeClient, queryClient } = require("../config/data.config");
const { InfluxDB, Point } = require("@influxdata/influxdb-client");
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
          const point = new Point("sensor")
            .tag("topic", data.topic)
            .floatFields(data.content);

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
