import deviceSensor from "./table/deviceSensor.table";
import groupContent from "./table/groupContent.table";
import groupContentSub from "./table/groupContentSub.table";
import pageContent from "./table/pageContent.table";
import order from "./table/order.table";
import customer from "./table/customer.table";

const classesFactory = {
  deviceSensor,
  groupContent,
  groupContentSub,
  pageContent,
  order,
  customer,
};

const classesFactoryMapping = {
  device_sensor: "deviceSensor",
  content_group: "groupContent",
  content_sub: "groupContentSub",
  content_page: "pageContent",
  order: "order",
  customer: "customer",
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
    if (!!tableSelect) return tableSelect.getInfomationToEdit();
  }
  return {};
};
export const exportFieldCheckDelete =(table) =>{
  var nameConvert = classesFactoryMapping[table];
  if (!!nameConvert) {
    var tableSelect = new classesFactory[nameConvert]();
    if (!!tableSelect) return tableSelect.getInfomationCheckDelete();
  }
  return {};
}
export const exportFieldtoAdd = (table) => {};

export const checkValidateValue = () => {};
