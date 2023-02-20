const GroupContent = require("./groupContent.model.js");
const PagesContent = require("./PagesContent.model.js");
const GroupContentSub = require("./groupContentSub.model.js");
const User = require("./user.model.js");
const SparcSensorWarning = require("./sparcSensorWarning.model");
const SparcSensorMaxMin = require("./sparcSensorMaxMin.model");
const SparcSensorData = require("./sparcSensorData.model");
const SparcGroupLocationSensor = require("./sparcGroupLocationSensor.model");
const SparcAqi = require("./sparcAqi.model");
const DeviceSensor = require("./deviceSensor.model");
const ExtendedData = require("./extendedData.model");
const StatusHistoryDevice = require("./statusHistoryDevice.model");
const Store = require("./store.model");
const ProductGroup = require("./productGroup.model");
const Product = require("./product.model");
const ProductStore = require("./productStore.model");
const ProductVariant = require("./productVariant.model");
const ProductImage = require('./productImage.model')
const ProductSpec = require('./productSpec.model')
// customer
const Customer = require("./customer.model.js");
const classesFactory = {
  User,
  GroupContent,
  ExtendedData,
  PagesContent,
  GroupContentSub,
  StatusHistoryDevice,
  SparcSensorWarning,
  SparcSensorMaxMin,
  SparcSensorData,
  SparcGroupLocationSensor,
  SparcAqi,
  DeviceSensor,
  Customer,
  Store,
  ProductGroup,
  Product,
  ProductStore,
  ProductVariant,
  ProductImage,
  ProductSpec
};
const classesFactorryMapping = {
  user: "User",
  customer: "Customer",
  extended_data: "ExtendedData",
  content_group: "GroupContent",
  content_page: "PagesContent",
  content_sub: "GroupContentSub",
  sparc_sensor_warning: "SparcSensorWarning",
  sparc_sensor_max_min: "SparcSensorMaxMin",
  sparc_sensor_data: "SparcSensorData",
  sparc_access_location_sensor: "SparcAcessLocationSensor",
  sparc_group_location_sensor: "SparcGroupLocationSensor",
  sparc_aqi: "SparcAqi",
  device_sensor: "DeviceSensor",
  status_history_device: "StatusHistoryDevice",
  product: "Product",
  store: "Store",
  product_group: "ProductGroup",
  product_store: "ProductStore",
  product_variant: "ProductVariant",
  product_image: "ProductImage"
};

const classesFactorryMappingUser = {
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
  device_sensor: "DeviceSensor",
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
