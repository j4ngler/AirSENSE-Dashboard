const Adress = require("./adress.model.js");
const GroupContent = require("./groupContent.model.js");
const PagesContent = require("./PagesContent.model.js");
const GroupContentSub = require("./groupContentSub.model.js");
const User = require("./user.model.js");
const SparcPosts = require("./sparcPosts.model");
const SparcSensorWarning = require("./sparcSensorWarning.model");
const SparcSensorMaxMin = require("./sparcSensorMaxMin.model");
const SparcSensorData = require("./sparcSensorData.model");
const SparcAcessLocationSensor = require("./sparcAcessLocationSensor.model");
const SparcGroupLocationSensor = require("./sparcGroupLocationSensor.model");
const SparcAqi = require("./sparcAqi.model");
const SparcLocationSensor = require("./sparcLocationSensor.model");
const ExtendedData = require("./extendedData.model");
const Location = require("./location.model");
const StatusHistoryDevice = require("./statusHistoryDevice.model");

// Course
const GroupCourse = require("./groupCourse.model.js");
const Course = require("./course.model.js");
const PagesCourse = require("./PagesCourse.model.js");

// Exam
const GroupExam = require("./groupExam.model");
const Exam = require("./exam.model");
const ExamDetail = require("./examDetail.model");
// customer
const Customer = require('./customer.model.js')
const classesFactory = {
  User,
  Adress,
  GroupContent,
  ExtendedData,
  Location,
  PagesContent,
  GroupContentSub,
  StatusHistoryDevice,
  SparcPosts,
  SparcSensorWarning,
  SparcSensorMaxMin,
  SparcSensorData,
  SparcAcessLocationSensor,
  SparcGroupLocationSensor,
  SparcAqi,
  SparcLocationSensor,
  GroupCourse,
  Course,
  PagesCourse,
  GroupExam,
  Exam,
  ExamDetail,
  Customer
};
const classesFactorryMapping = {
  users: "User",
  customer: "customer",
  adress: "Adress",
  extended_data: "ExtendedData",
  content_group: "GroupContent",
  location: "Location",
  content_page: "PagesContent",
  content_sub: "GroupContentSub",
  sparc_posts: "SparcPosts",
  sparc_sensor_warning: "SparcSensorWarning",
  sparc_sensor_max_min: "SparcSensorMaxMin",
  sparc_sensor_data: "SparcSensorData",
  sparc_access_location_sensor: "SparcAcessLocationSensor",
  sparc_group_location_sensor: "SparcGroupLocationSensor",
  sparc_aqi: "SparcAqi",
  sparc_location_sensor: "SparcLocationSensor",
  status_history_device: "StatusHistoryDevice",
  course_group: "GroupCourse",
  course: "Course",
  course_page: "PagesCourse",
  exam_group: "GroupExam",
  exam: "Exam",
  exam_detail: "ExamDetail",
};

const classesFactorryMappingUser = {
  adress: "Adress",
  extended_data: "ExtendedData",
  content_group: "GroupContent",
  content_page: "PagesContent",
  content_sub: "GroupContentSub",
  sparc_posts: "SparcPosts",
  sparc_sensor_warning: "SparcSensorWarning",
  sparc_sensor_max_min: "SparcSensorMaxMin",
  sparc_sensor_data: "SparcSensorData",
  sparc_access_location_sensor: "SparcAcessLocationSensor",
  sparc_group_location_sensor: "SparcGroupLocationSensor",
  sparc_aqi: "SparcAqi",
  course_group: "GroupCourse",
  course: "Course",
  course_page: "PageCourse",
  exam_group: "GroupExam",
  exam: "Exam",
  exam_detail: "ExamDetail",
};

exports.mangerModelAdmin = function (table) {
  var nameConvert = classesFactorryMapping[table];
  if (!!nameConvert) {
    var tableSelect = new classesFactory[nameConvert]();
    if (!!tableSelect) return tableSelect;
  }
  return false;
};

exports.mangerModelUser = function (table) {
  var nameConvert = classesFactorryMappingUser[table];
  if (!!nameConvert) {
    var tableSelect = new classesFactory[nameConvert]();
    if (!!tableSelect) return tableSelect;
  }
  return false;
};
