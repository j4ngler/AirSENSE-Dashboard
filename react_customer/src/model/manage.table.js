import deviceSensor from "./table/deviceSensor.table";
import groupContent from "./table/groupContent.table";
import groupContentSub from "./table/groupContentSub.table";
import pageContent from "./table/pageContent.table";
import order from "./table/order.table";
import customer from "./table/customer.table";
import sensorDeviceType from "./table/sensorDeviceType";
const classesFactory = {
  deviceSensor,
  groupContent,
  groupContentSub,
  pageContent,
  order,
  customer,
  sensorDeviceType
};

const classesFactoryMapping = {
  device_sensor: "deviceSensor",
  content_group: "groupContent",
  content_sub: "groupContentSub",
  content_page: "pageContent",
  order: "order",
  customer: "customer",
  sensor_device_type: "sensorDeviceType"
};

export const exportColumnTable = (table, callback = null) => {
  let nameConverted = classesFactoryMapping[table];
  if (!!nameConverted) {
    let tableSelected = new classesFactory[nameConverted]();
    if (!!tableSelected) return tableSelected.getColumnShow(callback);
  }
  return [];
};

export const exportFieldToEdit = (table) => {
  var nameConvert = classesFactoryMapping[table];
  if (!!nameConvert) {
    var tableSelect = new classesFactory[nameConvert]();
    if (!!tableSelect) return tableSelect.getInformationToEdit();
  }
  return {};
};
export const exportFieldCheckDelete = (table) => {
  var nameConvert = classesFactoryMapping[table];
  if (!!nameConvert) {
    var tableSelect = new classesFactory[nameConvert]();
    if (!!tableSelect) return tableSelect.getInformationCheckDelete();
  }
  return {};
};
export const exportFieldCheckEdit = (table) => {
  var nameConvert = classesFactoryMapping[table];
  if (!!nameConvert) {
    var tableSelect = new classesFactory[nameConvert]();
    if (!!tableSelect) return tableSelect.getInformationCheckEdit();
  }
  return {};
};

export const exportFieldToAdd = (table) => {
  const nameConvert = classesFactoryMapping[table];
  if (!!nameConvert) {
    const tableSelect = new classesFactory[nameConvert]();
    if (!!tableSelect) {
      let fieldExport = {};
      fieldExport.view = tableSelect.getInformationToAdd();
      fieldExport.html = tableSelect.getHTMLToAdd();
      fieldExport.selectTable = tableSelect.getTypeSelectTableToAdd();
      fieldExport.selectValidate = tableSelect.getInformationToValidate();
      return fieldExport;
    }
  }
  return {};
};
export const exportFieldSelectTable = (table) => {
  const nameConvert = classesFactoryMapping[table];
  if (!!nameConvert) {
    const tableSelect = new classesFactory[nameConvert]();
    if (!!tableSelect) {
      let fieldExport = {}
      fieldExport.main_id = tableSelect.getInformationToEdit().mainID
      fieldExport.main_info_title = tableSelect.getInformationToEdit().mainInfo.dataIndex
      return fieldExport
    }
  }
  return {}
}