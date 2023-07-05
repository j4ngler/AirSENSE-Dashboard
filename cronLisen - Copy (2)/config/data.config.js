require("dotenv").config();
const { InfluxDB, Point } = require("@influxdata/influxdb-client");

const token = process.env.INFLUXDB_TOKEN;
const url = "http://localhost:8086";

const client = new InfluxDB({ url, token });
let org = `SparcLab`;
let bucket = `airsense`;

let writeClient = client.getWriteApi(org, bucket, "ns");
let queryClient = client.getQueryApi(org);

module.exports = {
  writeClient,
  queryClient,
};
