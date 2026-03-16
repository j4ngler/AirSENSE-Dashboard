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

// Course
const GroupCourse = require("./groupCourse.model");
const Course = require("./course.model");
const PagesCourse = require("./PagesCourse.model");

// Exam
const GroupExam = require("./groupExam.model");
const Exam = require("./exam.model");
const ExamDetail = require("./examDetail.model");

const classesFactory = {
  User,
  Adress,
  GroupContent,
  PagesContent,
  GroupContentSub,
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
};
const classesFactorryMapping = {
  users: "User",
  adress: "Adress",
  content_group: "GroupContent",
  content_page: "PagesContent",
  content_sub: "GroupContentSub",
  sparc_posts: "SparcPosts",
  sparc_sensor_warning: "SparcSensorWarning",
  sparc_sensor_max_min: "SparcSensorMaxMin",
  data_average: "SparcSensorData",
  sparc_access_location_sensor: "SparcAcessLocationSensor",
  sensor_device_type: "SparcGroupLocationSensor",
  aqi_data: "SparcAqi",
  sparc_location_sensor: "SparcLocationSensor",
  course_group: "GroupCourse",
  course: "Course",
  course_page: "PagesCourse",
  exam_group: "GroupExam",
  exam: "Exam",
  exam_detail: "ExamDetail",
};

const classesFactorryMappingUser = {
  adress: "Adress",
  content_group: "GroupContent",
  content_page: "PagesContent",
  content_sub: "GroupContentSub",
  sparc_posts: "SparcPosts",
  sparc_sensor_warning: "SparcSensorWarning",
  sparc_sensor_max_min: "SparcSensorMaxMin",
  data_average: "SparcSensorData",
  sparc_access_location_sensor: "SparcAcessLocationSensor",
  sensor_device_type: "SparcGroupLocationSensor",
  aqi_data: "SparcAqi",
  course_group: "GroupCourse",
  course: "Course",
  course_page: "PagesCourse",
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
