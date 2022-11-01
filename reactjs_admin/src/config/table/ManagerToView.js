import User_View from './user.table.js';
import GroupContent from './GroupContent.table';
import GroupContentSub from './GroupContentSub.table.js';
import PagesContent from './PagesContent.table';
import Customer from './Customer.table';
import {
  validateEmail,
  validatePhone,
  isNumeric,
  validateDate,
} from '../../utils/commonUtil';
// import SparcAqi from './SparcAqi.table';
// import ExtendedData from './ExtendedData.table';
import DeviceSensor from './DeviceSensor.table.js';
// import user_admin from './user_admin.table';


const classesFactory = {
  User_View,
  DeviceSensor,  
  GroupContent,
  GroupContentSub,
  PagesContent,
  Customer,
  PagesContent
};
const classesFactorryMapping = {
  user: 'User_View',
  content_group: 'GroupContent',
  content_sub: "GroupContentSub",
  content_page: 'PagesContent',
  content_sub: 'GroupContentSub',
  customer: 'Customer',
  device_sensor: 'DeviceSensor',
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
