const TypeModel = require("../middlewareDatabase/TypeModel.js");
const TableView = require("../middlewareDatabase/TableView.js");
const TableManifest = require("../middlewareDatabase/TableManifest.js");
const TABLE_NAME = "sparc_sensor_data";
const CommonModel = require("../middlewareDatabase/CommonModel.js");
const defineManifest = require("../../middlewares/CheckManifest.js");
const CustomerAcess = require("../middlewareDatabase/CustomerAcess.js");
/**
 * User model.
 */
class SparcSensorData extends CommonModel {
  /**
   * Get table name.
   */
  get tableName() {
    return TABLE_NAME;
  }

  /**
   * Table has timestamps.
   */
  get hasTimestamps() {
    return true;
  }
  /*
  verifyPassword(password) {
    return this.get('password') === password;
  } */
  getNameTable() {
    return TABLE_NAME;
  }
  getTypeTable() {
    return TypeModel.NEWS;
  }
  customerAcess() {
    return {
      edit: CustomerAcess.NOT_ACESS,
      add: CustomerAcess.NOT_ACESS,
      view: CustomerAcess.NOT_ACESS,
    };
  }
  getFieldToAdd() {
    return {
      valueSetup: [
        "station_id",
        "PM2p5",
        "PM10",
        "PM1",
        "Temperature",
        "Humidity",
        "Pressure",
        "SO2",
        "NO2",
        "CO2",
        "CO",
        "O3",
        "NO2A",
        "NO2W",
        "O3W",
        "O3A",
        "COW",
        "COA",
        "SO2W",
        "SO2A",
      ],
    };
  }
  //
  // "station_id","Time","PM2p5","PM10","PM1","Temperature","Humidity","Pressure","SO2","NO2","CO2","CO","O3","NO2A","NO2W","O3W","O3A","COW","COA","SO2W","SO2A"

  getFieldToDelete() {
    return {
      arrayCoppy: [
        "station_id",
        "PM2p5",
        "PM10",
        "PM1",
        "Temperature",
        "Humidity",
        "Pressure",
        "SO2",
        "NO2",
        "CO2",
        "CO",
        "O3",
        "NO2A",
        "NO2W",
        "O3W",
        "O3A",
        "COW",
        "COA",
        "SO2W",
        "SO2A",
      ],
      locationSelect: "Time",
      valueSelect: "",
      userUpdate: "",
    };
  }

  getSQLReport(currentUser) {
    console.log("getSQLReport...2....... ", currentUser.manifestid);
    return "SELECT data_average.* FROM data_average ";
    //   + defineManifest.checkManifestTableUser(currentUser.manifestid,currentUser.users_id,currentUser.value_manifest));
  }
  getJsonTofind() {
    return [];
  }
}

module.exports = SparcSensorData;
