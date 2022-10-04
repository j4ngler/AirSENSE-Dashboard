import User_View from './user.table.js';

import Adress from './Adress.table';
import DecentralizationAccess from './DecentralizationAccess.table';
import GroupContent from './GroupContent.table';
import MqttMicroservice from './MqttMicroservice.table';
import MqttUser from './MqttUser.table';
import PagesContent from './PagesContent.table';
import AdvertisementContent from './AdvertisementContent.table';
import BackProduct from './BackProduct.table';
import BillService from './BillService.table';
import LostProduct from './LostProduct.table';
import Enterprise from './Enterprise.table';
import DetailBank from './DetailBank.table';
import Customer from './Customer.table';
import Company from './Company.table';
import StoreProduct from './StoreProduct.table';
import Product from './Product.table';
import BuyProductDetail from './BuyProductDetail.table';
import BuyProduct from './BuyProduct.table';
import ReturnService from './ReturnService.table';
import ChargingService from './ChargingService.table';
import Service from './Service.table';
import GroupContentSub from './GroupContentSub.table';
import {
  validateEmail,
  validatePhone,
  isNumeric,
  validateDate,
} from '../../utils/commonUtil';
import SparcAqi from './SparcAqi.table';
import ExtendedData from './ExtendedData.table';
import Location from './Location.table';
import SparcAcessLocationSensor from './SparcAcessLocationSensor.table';
import sparcGroupLocationSensor from './sparcGroupLocationSensor.table';
import SparcLocationSensor from './SparcLocationSensor.table';
import SparcSensorData from './SparcSensorData.table';
import user_admin from './user_admin.table';
import SparcSensorMaxMin from './SparcSensorMaxMin.table';

// Course
import GroupCourse from './GroupCourse.table.js';
import Course from './Course.table.js';
import PagesCourse from './PagesCourse.table.js';

// Exam
import GroupExam from './GroupExam.table';
import Exam from './Exam.table';
import ExamDetail from './ExamDetail.table';

const classesFactory = {
  User_View,
  user_admin,
  Adress,
  DecentralizationAccess,
  GroupContent,
  MqttMicroservice,
  MqttUser,
  PagesContent,
  AdvertisementContent,
  BillService,
  LostProduct,
  Enterprise,
  DetailBank,
  Customer,
  Company,
  StoreProduct,
  Product,
  BuyProductDetail,
  BuyProduct,
  BackProduct,
  ReturnService,
  ChargingService,
  Service,
  GroupContentSub,
  SparcAqi,
  ExtendedData,
  Location,
  SparcAcessLocationSensor,
  sparcGroupLocationSensor,
  SparcLocationSensor,
  SparcSensorData,
  SparcSensorMaxMin,
  GroupCourse,
  Course,
  PagesCourse,
  GroupExam,
  Exam,
  ExamDetail,
};
const classesFactorryMapping = {
  users: 'User_View',
  user_admin: 'user_admin',
  adress: 'Adress',
  decentralization_access: 'DecentralizationAccess',
  content_group: 'GroupContent',
  mqtt_microservice: 'MqttMicroservice',
  mqtt_user: 'MqttUser',
  content_page: 'PagesContent',
  advertisement_content: 'AdvertisementContent',
  backproduct: 'BackProduct',
  bill_service: 'BillService',
  lostproduct: 'LostProduct',
  enterprise: 'Enterprise',
  detailbank: 'DetailBank',
  customer: 'Customer',
  company: 'Company',
  storeproduct: 'StoreProduct',
  product: 'Product',
  buyproductdetail: 'BuyProductDetail',
  buyproduct: 'BuyProduct',
  return_service: 'ReturnService',
  charging_service: 'ChargingService',
  service: 'Service',
  content_sub: 'GroupContentSub',
  sparc_aqi: 'SparcAqi',
  extended_data: 'ExtendedData',
  location: 'Location',
  sparc_access_location_sensor: 'SparcAcessLocationSensor',
  sparc_group_location_sensor: 'sparcGroupLocationSensor',
  sparc_location_sensor: 'SparcLocationSensor',
  sparc_sensor_data: 'SparcSensorData',
  sparc_sensor_max_min:"SparcSensorMaxMin",
  course_group: 'GroupCourse',
  course: 'Course',
  course_page: 'PagesCourse',
  exam_group: 'GroupExam',
  exam: 'Exam',
  exam_detail: 'ExamDetail',
};

export const exportColumeData = (table, callback = null) => {
  var nameConvert = classesFactorryMapping[table];
  if (!!nameConvert) {
    var tableSelect = new classesFactory[nameConvert]();
    if (!!tableSelect) return tableSelect.getColumeShow(callback);
  }
  return [];
};

export const exportColumeEdit = (table) => {
  var nameConvert = classesFactorryMapping[table];
  if (!!nameConvert) {
    var tableSelect = new classesFactory[nameConvert]();
    if (!!tableSelect) return tableSelect.getInfoToEdit();
  }
  return {};
};

export const exportColumeAdd = (table) => {
  var nameConvert = classesFactorryMapping[table];
  if (!!nameConvert) {
    var tableSelect = new classesFactory[nameConvert]();
    if (!!tableSelect) {
      var dataValue = {};
      dataValue.view = tableSelect.getInfoToAdd();
      dataValue.title = tableSelect.getTitleToAdd();
      dataValue.html = tableSelect.getHtmlAdd();
      dataValue.typeSelect = tableSelect.getTypeSelectToAdd();
      dataValue.selectTabble = tableSelect.getTypeSelectTabbleToAdd();
      dataValue.selectValidate = tableSelect.getColumeValidate();
      return dataValue;
    }
  }
  return {};
};

export const checkValidateValue = (infoTitle, value) => {
  var validate = { validate: true, err: ' ' };
  for (var i = 0; i < infoTitle.length; i++) {
    let detail = infoTitle[i].view;
    let titleCheck = infoTitle[i].title;
    let accessValue = value[detail];
    let checkValidate = infoTitle[i].selectValidate;
    validate.err = titleCheck + '= ' + accessValue + ' ! ';
    if (checkValidate == 'email') {
      if (!validateEmail(accessValue)) {
        validate.validate = false;
        validate.err += 'Xin vui lòng check email';
        break;
      }
    } else if (checkValidate == 'phone') {
      if (!validatePhone(accessValue)) {
        validate.validate = false;
        validate.err += 'Xin vui lòng kiểm tra định dạng phone';
        break;
      }
    } else if (checkValidate == 'password') {
      if (accessValue.length < 6) {
        validate.validate = false;
        validate.err += 'Độ dài mật khẩu <6';
        break;
      }
    } else if (checkValidate == 'leng3') {
      if (accessValue.length < 3) {
        validate.validate = false;
        validate.err += 'Độ dài ký tự không hợp lệ , độ dài >3';
        break;
      }
    } else if (checkValidate == 'leng6') {
      if (accessValue.length < 6) {
        validate.validate = false;
        validate.err += 'Độ dài ký tự không hợp lệ , độ dài >6';
        break;
      }
    } else if (checkValidate == 'number') {
      if (!isNumeric(accessValue)) {
        validate.validate = false;
        validate.err += 'Định dạng phải là số';
        break;
      }
    } else if (checkValidate == 'date') {
      if (!validateDate(accessValue)) {
        validate.validate = false;
        validate.err += 'Không đúng định dạng ngày tháng năm';
        break;
      }
    }
  }
  return validate;
};
