const CommonModel = require("../middlewareDatabase/CommonModel.js");
var squel = require("squel");
const knex = require("../../config/knex.js");

class ReportManager extends CommonModel {
  reportListSql(sqlCommandTable) {
    return new Promise((resolve, reject) => {
      if (sqlCommandTable == null) reject(false);
      if (sqlCommandTable.length == 1) {
        knex
          .raw(sqlCommandTable[0].sql)
          .then(function (result) {
            // console.log(result);
            var dataReturn = {};
            dataReturn[sqlCommandTable[0].table] = result;
            resolve(dataReturn);
          })
          .catch(function (err) {
            // console.log(err);
            return reject(err);
          });
      } else if (sqlCommandTable.length == 2) {
        knex
          .raw(sqlCommandTable[0].sql)
          .then(function (result) {
            // console.log(result);
            var dataReturn = {};
            dataReturn[sqlCommandTable[0].table] = result;
            knex
              .raw(sqlCommandTable[1].sql)
              .then(function (result1) {
                // console.log(result);
                dataReturn[sqlCommandTable[1].table] = result1;
                resolve(dataReturn);
              })
              .catch(function (err) {
                resolve(dataReturn);
              });
          })
          .catch(function (err) {
            // console.log(err);
            return reject(err);
          });
      } else if (sqlCommandTable.length == 3) {
        knex
          .raw(sqlCommandTable[0].sql)
          .then(function (result) {
            // console.log(result);
            var dataReturn = {};
            dataReturn[sqlCommandTable[0].table] = result;
            knex
              .raw(sqlCommandTable[1].sql)
              .then(function (result1) {
                // console.log(result);
                dataReturn[sqlCommandTable[1].table] = result1;
                knex
                  .raw(sqlCommandTable[2].sql)
                  .then(function (result2) {
                    // console.log(result);
                    dataReturn[sqlCommandTable[2].table] = result2;
                    resolve(dataReturn);
                  })
                  .catch(function (err) {
                    resolve(dataReturn);
                  });
              })
              .catch(function (err) {
                resolve(dataReturn);
              });
          })
          .catch(function (err) {
            // console.log(err);
            return reject(err);
          });
      } else if (sqlCommandTable.length == 4) {
        knex
          .raw(sqlCommandTable[0].sql)
          .then(function (result) {
            // console.log(result);
            var dataReturn = {};
            dataReturn[sqlCommandTable[0].table] = result;
            knex
              .raw(sqlCommandTable[1].sql)
              .then(function (result1) {
                // console.log(result);
                dataReturn[sqlCommandTable[1].table] = result1;
                knex
                  .raw(sqlCommandTable[2].sql)
                  .then(function (result2) {
                    // console.log(result);
                    dataReturn[sqlCommandTable[2].table] = result2;
                    knex
                      .raw(sqlCommandTable[4].sql)
                      .then(function (result3) {
                        // console.log(result);
                        dataReturn[sqlCommandTable[4].table] = result3;
                        resolve(dataReturn);
                      })
                      .catch(function (err) {
                        resolve(dataReturn);
                      });
                  })
                  .catch(function (err) {
                    resolve(dataReturn);
                  });
              })
              .catch(function (err) {
                resolve(dataReturn);
              });
          })
          .catch(function (err) {
            // console.log(err);
            return reject(err);
          });
      }
    });
  }
  reportPage(typePages) {
    var report = squel
      .select()
      .from("content_page")
      .where("group_file ='" + typePages + "'")
      .where("deleteflag = 0")
      .limit(100);
    //    console.log('reportPage reportPage');
    //    console.log(report.toString());
    return new Promise((resolve, reject) => {
      knex
        .raw(report.toString())
        .then(function (result) {
          // console.log(result);
          resolve(result);
        })
        .catch(function (err) {
          // console.log(err);
          return reject(err);
        });
    });
  }
  deletePageContent(idset) {
    var authen = squel.update().table("content_page");
    authen
      .where("id=" + idset)
      .set("deleteflag", 1)
      .set("updateat", "NOW()", { dontQuote: true });
    // console.log(authen.toString());
    return new Promise((resolve, reject) => {
      knex
        .raw(authen.toString())
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          return reject(err);
        });
    });
  }

  reportProductDetail(productId) {
    var report =
      "SELECT product.* , db.* ,dc.* FROM product LEFT JOIN product_sale_support db ON" +
      " db.productid=product.productid LEFT JOIN product_sale_km dc ON dc.id_km=db.idkm " +
      " WHERE product.productid=" +
      productId;
    return new Promise((resolve, reject) => {
      knex
        .raw(report)
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          return reject(err);
        });
    });
  }

  addProductPageDetail(content, link, userid) {
    //  let content=link;
    let cost = content["cost"];
    let deviceid = content["deviceid"];
    var authen = squel
      .insert()
      .into("content_page")
      .set("userid", userid)
      .set("cost", cost)
      .set("deviceid", deviceid)
      .set("content", link)
      .set("id_create", " userid")
      .set("id_update", " userid")
      .set("createat", "NOW()", { dontQuote: true })
      .set("updateat", "NOW()", { dontQuote: true })
      .set("deleteflag", 0);
    // console.log(authen.toString());
    return new Promise((resolve, reject) => {
      knex
        .raw(authen.toString())
        .then(function (result) {
          // console.log(result);
          resolve(result);
        })
        .catch(function (err) {
          // console.log(err);
          return reject(err);
        });
    });
  }

  reportUserData(id) {
    var authen = squel
      .select()
      .from("users")
      .where("userid=" + id)
      .where("deleteflag = 0");
    return new Promise((resolve, reject) => {
      knex
        .raw(authen.toString())
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          return reject(err);
        });
    });
  }

  reportListSql(content, userid) {
    var tableSQL = content["tableSelection"];
    var tableToget = [];

    for (var i = 0; i < tableSQL.length; i++) {
      var authen = squel
        .select()
        .from(tableSQL[i].table)
        .where("deleteflag = 0");
      tableToget.push({ table: tableSQL[i].table, sql: authen.toString() });
    }

    var authen = squel
      .select()
      .from("users")
      .where("userid=" + id)
      .where("deleteflag = 0");
    return new Promise((resolve, reject) => {
      knex
        .raw(authen.toString())
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          return reject(err);
        });
    });
  }

  reportUserPage(page) {
    var authen = squel
      .select()
      .from("content_page")
      .where("id=" + id)
      .where("deleteflag = 0");
    return new Promise((resolve, reject) => {
      knex
        .raw(authen.toString())
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          return reject(err);
        });
    });
  }
  reportDeivceToControl(tocken) {
    var authen = squel
      .select()
      .from("device_control")
      .where("tocken=" + tocken)
      .where("deleteflag = 0");
    return new Promise((resolve, reject) => {
      knex
        .raw(authen.toString())
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          return reject(err);
        });
    });
  }

  saveDataSensorToSql(arrayData) {
    return new Promise((resolve, reject) => {
      if (arrayData.length > 8) {
        var nameStation = arrayData[0].split(" ");
        if (nameStation.length > 0 && nameStation[0] == "$STATION") {
          var authen = squel
            .insert()
            .into("sparc_sensor_data")
            .set("timestampe", new Date().getTime())
            .set("station_id", nameStation[1])
            .set("time", arrayData[1])
            .set("vbat", arrayData[2])
            .set("broad_temp", arrayData[3])
            .set("ch1_freq", arrayData[4])
            .set("ch1_temp", arrayData[5])
            .set("ch2_freq", arrayData[6])
            .set("ch2_temp", arrayData[7])
            .set("flag", arrayData[8].split("#")[0]);
          console.log(authen.toString());
          knex
            .raw(authen.toString())
            .then(function (result) {
              console.log(result);
              resolve(result);
            })
            .catch(function (err) {
              console.log(err);
              return reject(err);
            });
        } else return reject(false);
      } else return reject(false);
    });
  }

  savePageWirteHtml(content, linkfile, idcreate) {
    let contentPagarap = content["content"];
    let title = content["title"];
    let group = content["group"];
    let bigTitle = content["maintitle"];
    var authen = squel
      .insert()
      .into("content_page")
      .set("group_file", group)
      .set("filesave", linkfile)
      .set("title", title)
      .set("id_create", idcreate)
      .set("id_update", idcreate)
      .set("content", " content")
      .set("createat", "NOW()", { dontQuote: true })
      .set("updateat", "NOW()", { dontQuote: true })

      .set("deleteflag", 0);
    // console.log(authen.toString());
    return new Promise((resolve, reject) => {
      knex
        .raw(authen.toString())
        .then(function (result) {
          // console.log(result);
          resolve(result);
        })
        .catch(function (err) {
          //console.log(err);
          return reject(err);
        });
    });
  }

  saveDetailProducttml(content, linkfile, idcreate) {
    let productid = content["productid"];
    var authen = squel
      .insert()
      .into("product_content")
      .set("productid", productid)
      .set("filesave", linkfile)
      .set("id_create", idcreate)
      .set("id_update", idcreate)
      .set("createat", "NOW()", { dontQuote: true })
      .set("updateat", "NOW()", { dontQuote: true })
      .set("deleteflag", 0);
    console.log(authen.toString());
    return new Promise((resolve, reject) => {
      knex
        .raw(authen.toString())
        .then(function (result) {
          console.log(result);
          resolve(result);
        })
        .catch(function (err) {
          console.log(err);
          return reject(err);
        });
    });
  }

  getThreshholdIndex() {
    var query = squel
      .select()
      .from("sparc_sensor_max_min")
      .where("deleteflag = 0");
    return new Promise((resolve, reject) => {
      knex
        .raw(query.toString())
        .then(function (result) {
          resolve(result[0]);
        })
        .catch(function (err) {
          return reject(err);
        });
    });
  }

  saveRecordWarning(station, content, userId) {
    var query = squel
      .insert()
      .into("sparc_sensor_warning")
      .set("station_id", station)
      .set("content", content)
      .set("id_create", userId)
      .set("id_update", userId)
      .set("createat", "NOW()", { dontQuote: true })
      .set("updateat", "NOW()", { dontQuote: true })
      .set("deleteflag", 0);
    return new Promise((resolve, reject) => {
      knex
        .raw(query.toString())
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          return reject(err);
        });
    });
  }

  getStatistics(fromTime, toTime, station_id) {
    var query = squel
      .select()
      .from("sparc_sensor_data")
      .field("station_id")
      .field("AVG(vbat)", "vbat_avr")
      .field("MAX(vbat)", "vbat_max")
      .field("MIN(vbat)", "vbat_min")
      .field("SUM(vbat)", "vbat_sum")
      .field("AVG(broad_temp)", "broad_temp_avr")
      .field("MAX(broad_temp)", "broad_temp_max")
      .field("MIN(broad_temp)", "broad_temp_min")
      .field("SUM(broad_temp)", "broad_temp_sum")
      .field("AVG(ch1_freq)", "ch1_freq_avr")
      .field("MAX(ch1_freq)", "ch1_freq_max")
      .field("MIN(ch1_freq)", "ch1_freq_min")
      .field("SUM(ch1_freq)", "ch1_freq_sum")
      .field("AVG(ch1_temp)", "ch1_temp_avr")
      .field("MAX(ch1_temp)", "ch1_temp_max")
      .field("MIN(ch1_temp)", "ch1_temp_min")
      .field("SUM(ch1_temp)", "ch1_temp_sum")
      .field("AVG(ch2_freq)", "ch2_freq_avr")
      .field("MAX(ch2_freq)", "ch2_freq_max")
      .field("MIN(ch2_freq)", "ch2_freq_min")
      .field("SUM(ch2_freq)", "ch2_freq_sum")
      .field("AVG(ch2_temp)", "ch2_temp_avr")
      .field("MAX(ch2_temp)", "ch2_temp_max")
      .field("MIN(ch2_temp)", "ch2_temp_min")
      .field("SUM(ch2_temp)", "ch2_temp_sum")
      .field("AVG(flag)", "flag_avr")
      .field("MAX(flag)", "flag_max")
      .field("MIN(flag)", "flag_min")
      .field("SUM(flag)", "flag_sum");
    if (fromTime != undefined) {
      query = query.where("time>='" + fromTime + "'");
    }
    if (toTime != undefined) {
      query = query.where("time<'" + toTime + "'");
    }
    if (station_id.includes(",")) {
      query = query.where("station_id IN " + station_id);
    } else query = query.where("station_id = '" + station_id + "'");
    return new Promise((resolve, reject) => {
      knex
        .raw(query.toString())
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          return reject(err);
        });
    });
  }

  getDataForChart(fromTime, toTime, station_id, role) {
    var query = squel.select().from("sparc_sensor_data");
    if (fromTime != undefined) {
      query = query.where("time>='" + fromTime + "'");
    }
    if (toTime != undefined) {
      query = query.where("time<'" + toTime + "'");
    }
    if (station_id.includes(",")) {
      query = query.where("sparc_sensor_data.station_id IN " + station_id);
    } else
      query = query.where(
        "sparc_sensor_data.station_id = '" + station_id + "'"
      );
    return new Promise((resolve, reject) => {
      knex
        .raw(query.toString())
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          return reject(err);
        });
    });
  }

  getAbnormalData() {
    var query = squel.select().from("sparc_sensor_warning").order("id", false);
    return new Promise((resolve, reject) => {
      knex
        .raw(query.toString())
        .then(function (result) {
          console.log("ssssss: ", result);
          for (var i = 0; i < result.length; i++) {
            result[i].content = Buffer.from(
              result[i].content,
              "base64"
            ).toString("ascii");
          }
          resolve(result);
        })
        .catch(function (err) {
          return reject(err);
        });
    });
  }

  getStation(stationId) {
    var query = squel
      .select()
      .from("sparc_location_sensor")
      .where("station_id = " + stationId);
    return new Promise((resolve, reject) => {
      if (stationId.includes(",")) {
        var station = { content: "All" };
        resolve(station);
      }
      knex
        .raw(query.toString())
        .then(function (stations) {
          resolve(stations[0]);
        })
        .catch(function (err) {
          return reject(err);
        });
    });
  }

  getReportStations(fromTime, toTime, station_id, role) {
    var query = squel.select().from("sparc_sensor_data");
    if (fromTime != undefined) {
      query = query.where("Time>=" + fromTime / 1000);
    }
    if (toTime != undefined) {
      query = query.where("Time<" + toTime / 1000);
    }
    var privilege;
    // check manifest
    // if(DataTableRole.sparc_location_sensor[role.role] == undefined || DataTableRole.sparc_location_sensor[role.role].view==undefined) return;
    // var privilege = DataTableRole.sparc_location_sensor[role.role].view;
    // var privilege = DataTableRole.sparc_location_sensor[role.manifestid].view;
    // when you are the suppoter
    // if(privilege=="own") {
    //     query.join( "sparc_location_sensor", null, squel.expr().and("sparc_location_sensor.station_id = sparc_sensor_data.station_id"));
    //     query.where("sparc_location_sensor.id_create = "+"'"+role.userid+"'");
    // }
    if (station_id.includes(",")) {
      query = query.where("sparc_sensor_data.station_id IN " + station_id);
    } else
      query = query.where(
        "sparc_sensor_data.station_id = '" + station_id + "'"
      );
      console.log(query.toString());
    return new Promise((resolve, reject) => {
      knex
        .raw(query.toString())
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          return reject(err);
        });
    });
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
}

module.exports = ReportManager;
