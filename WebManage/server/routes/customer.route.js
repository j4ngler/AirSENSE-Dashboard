const express = require("express");
const fs = require("fs");
const customerCtrl = require("../controllers/customer.controller.js");
const isAuthenticated = require("../middlewares/authenticate.js");
const isAuthenticatedCustomer = require("../middlewares/authenticateCustomer.js");
const isAuthorizedCustomer = require("../middlewares/authorizeCustomer.js");
const mangerModel = require("../models/database/managerAll.model.js");
const router = express.Router();
const multer = require("multer");
const files = require("../utils/files.js");
const urlStaticLink = require("../config/urlSetting.js");
const validate = require("../config/joi.validate.js");
const schema = require("../utils/validator.js");
const { Schema } = require("mongoose");
const { isAuthenticatedAll } = require("../middlewares/authenticateAll.js");
const authorizeCustomerDevice = require("../middlewares/authorizeCustomerDevice.js");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = "public/uploads/datas";
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const storageImgUser = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = "public/uploads/ProfileImgage";
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

let upload = multer({ storage: storage, fileFilter: files.excelFilter });

//server
router
  .route("/import-data")
  .post(isAuthenticated, upload.single("file"), (req, res) => {
    customerCtrl.importDataExcel(req, res);
  });

let uploadImage = multer({ storage: storage, fileFilter: files.imageFilter });

router
  .route("/import-image")
  .post(isAuthenticatedAll, uploadImage.single("file"), (req, res) => {
    customerCtrl.importDataInfo(req, res);
  });

router.route("/upload-image").post(uploadImage.single("file"), (req, res) => {
  customerCtrl.importDataInfo(req, res);
});

let uploadImageUser = multer({
  storage: storageImgUser,
  fileFilter: files.imageFilter,
});

router
  .route("/image-user")
  .post(isAuthenticated, uploadImageUser.single("file"), (req, res) => {
    res.send(
      JSON.stringify({
        path: req.file.path,
        file: req.file,
        url: urlStaticLink + "/uploads/ProfileImgage/" + req.file.filename,
      })
    );
  });

router.route("/report").post(isAuthenticatedCustomer, (req, res) => {
  customerCtrl.getTableData(req, res);
});

router.route("/report-by-group").post(isAuthenticatedCustomer, (req, res) => {
  customerCtrl.getTableDataByGroup(req, res);
});

router.route("/report-page").post(isAuthenticatedCustomer, (req, res) => {
  customerCtrl.getNumberPages(req, res);
});

router.route("/manager_add").post(isAuthenticatedCustomer, (req, res) => {
  customerCtrl.addDataToTable(req, res);
});
router.route("/manager_delete").post(isAuthorizedCustomer, (req, res) => {
  customerCtrl.deleteData(req, res);
});
router.route("/manager_update").post(isAuthenticatedCustomer, (req, res) => {
  customerCtrl.updateData(req, res);
});

router.route("/register").post(isAuthenticated, (req, res) => {
  customerCtrl.registerUser(req, res);
});

router
  .route("/update_info")
  .put(
    validate(schema.updateCustomerInfo),
    isAuthenticatedCustomer,
    (req, res) => {
      customerCtrl.updateInfo(req, res);
    }
  );

router
  .route("/change_password")
  .put(validate(schema.changeCusPass), isAuthenticatedCustomer, (req, res) => {
    customerCtrl.changePassword(req, res);
  });

//dashboard
router.route("/dashboard-data-average").get(isAuthenticatedCustomer, customerCtrl.getDataAverage);

//manageCustomer
router.route("/add-customer").post(isAuthorizedCustomer,customerCtrl.addCustomer)

// education

router.route("/getAllCourses").get(isAuthenticatedCustomer, (req, res) => {
  customerCtrl.getAllCourses(req, res);
});

router.route("/advertisement").get((req, res) => {
  customerCtrl.getAllAdvertisementContent(req, res);
});
router
  .route("/info_product")
  .get((req, res) => {
    customerCtrl.getAllInfoProduct(req, res);
  })
  .post((req, res) => {
    customerCtrl.getInfoProduct(req, res);
  });

router
  .route("/detail_product")
  .get((req, res) => {
    customerCtrl.getDetailProduct(req, res);
  })
  .post((req, res) => {
    customerCtrl.getDetailProduct(req, res);
  });

router.route("/bill").post((req, res) => {
  customerCtrl.setTheBillData(req, res);
});

router.route("/detail_bill").post((req, res) => {
  customerCtrl.getDetailTheBill(req, res);
});

router.route("/services").get((req, res) => {
  customerCtrl.getAllInfoServices(req, res);
});

//blog
router.route("/get-content-blog/:id").get(async (req, res) => {
  try {
    var data = req.params.id;

    const storeHtmlFilePath = path.join(
      __dirname,
      "../../public",
      `storeHtml/${data}`
    );
    const htmlContent = fs.readFileSync(storeHtmlFilePath, "utf8");
    return res.status(200).json({ message: "ok", data: htmlContent });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Server error" })
  }

});
router.route("/updatePages").post(isAuthorizedCustomer, (req, res) => {
  customerCtrl.postUpdatePageToDataBase(req, res);
});
//sale
router.route("/lst_product").post(customerCtrl.getInfoProductStore);
router.route("/page_product").get(customerCtrl.getDetailProductPages);
router.get("/sale/cart", (req, res) => {
  console.log("render")
  res.render("sale/invoiceInfoProduct");
});

//test device_id
router
  .route("/test_device")
  .get(authorizeCustomerDevice, (req, res) => {
    res.status(200).json("ok")
  });

module.exports = router;
