const express = require("express");
const multer = require("multer");
const router = express.Router();
const isAuthenticated = require("../middlewares/authenticate.js");
const path = require("path");
const { uploadFileS3 } = require("../models/S3UploadFile.js");
const documentCtrl = require("../controllers/document.controller.js");
const urlStaticLink = require("../config/urlSetting.js");
const { returnFalse, returnOKCustom } = require("../utils/returnResponse.js");
const WarningInfo = require("../utils/warningInfo.js");
const { isAuthenticatedAll } = require("../middlewares/authenticateAll.js");
var squel = require("squel");

var detail_X = process.env.APP_PORT || 3000;
var detailLink = process.env.APP_HOST + ":" + detail_X;

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dirFolder + "/public/img/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + file.originalname);
  },
});

var upload = multer({ storage: storage });

router.post(
  "/uploadimage",
  upload.single("resumeFileBrowser"),
  async function (req, res) {
    console.log("uploadimage", req);
    let url = await uploadFileS3(req.file.path, req.file.filename);
    if (url != null) returnOKCustom(res, { url: url });
    else
      returnFalse(
        res,
        { error: true, data: { message: "Not upload file" } },
        WarningInfo.NOT_UPLOAD_FILE
      );
  }
);

router.route("/uploadFile").post((req, res) => {
  let image = req.files.uploadFile;
  console.log(image);
  image.mv(path.resolve(__dirname, "/public/upload", image.name), (error) => {
    let fileName = "/upload/" + image.name;
    console.log(fileName);
    res.send(fileName);
  });
});

// writer pages
router
  .route("/registerPages")
  .get((req, res) => {
    res.render("document/registerPages");
  })
  .post(isAuthenticatedAll, (req, res) => {
    documentCtrl.postAddPageToDataBase(req, res);
  });

// writer pages
router.route("/updatePages").post(isAuthenticated, (req, res) => {
  documentCtrl.postUpdatePageToDataBase(req, res);
});
router
  .route("/registerProductPages")
  .post(isAuthenticated, documentCtrl.postAddProductPageToDataBase);
// update Course
router.route("/updateCourse").post(isAuthenticated, (req, res) => {
  documentCtrl.postUpdateCourseToDataBase(req, res);
});

// writer Course
router
  .route("/registerCourse")
  .get((req, res) => {
    res.render("course/registerCourse");
  })
  .post(isAuthenticated, (req, res) => {
    documentCtrl.postAddCourseToDataBase(req, res);
  });

// update Exam
router.route("/updateExam").post(isAuthenticated, (req, res) => {
  documentCtrl.postUpdateExamToDataBase(req, res);
});

// writer Exam
router
  .route("/registerExam")
  .get((req, res) => {
    res.render("course/registerCourse");
  })
  .post(isAuthenticated, (req, res) => {
    documentCtrl.postAddExamToDataBase(req, res);
  });

// writer Advertisement
router.route("/registerAdvertisement").post(isAuthenticated, (req, res) => {
  documentCtrl.postAddAdvertisementToDataBase(req, res);
});

// writer Advertisement
router.route("/updateAdvertisement").post(isAuthenticated, (req, res) => {
  documentCtrl.postUpdateAdvertisementToDataBase(req, res);
});

// Blog and Education
router.route("/document_detail/:typePage").get(async (req, res) => {
  var dataX = req.params.typePage;
  console.log("e.responseText", dataX);
  var data = await documentCtrl.getAllContentDetailPage(dataX);
  res.send(JSON.stringify(data));
});

router.route("/lastest_detail/:typePage").get(async (req, res) => {
  var dataX = req.params.typePage;
  console.log("e.responseText", dataX);
  var data = await documentCtrl.getAllContentLatestPage(dataX);
  res.send(JSON.stringify(data));
});

router.route("/group_page").post(async (req, res) => {
  var data = await documentCtrl.getAllInGroupPage(req);
  res.send(JSON.stringify(data));
});

router.route("/list_blog").get(async (req, res) => {
  const data = await documentCtrl.getListBlog();
  res.send(JSON.stringify(data));
});

// Course

router.route("/detail_lesson/:typePage").get(async (req, res) => {
  var dataX = req.params.typePage;
  console.log("e.responseText", dataX);
  var data = await documentCtrl.getAllContentDetailCourse(dataX);
  res.send(JSON.stringify(data));
});

router.route("/lastest_detail_lesson/:typePage").get(async (req, res) => {
  var dataX = req.params.typePage;
  console.log("e.responseText", dataX);
  var data = await documentCtrl.getAllContentLatestCourse(dataX);
  res.send(JSON.stringify(data));
});

router.route("/group_lesson").post(async (req, res) => {
  var data = await documentCtrl.getAllInGroupCourse(req);
  res.send(JSON.stringify(data));
});

//

// Exam

router.route("/detail_exam/:typePage").get(async (req, res) => {
  var dataX = req.params.typePage;
  console.log("e.responseText", dataX);
  var data = await documentCtrl.getAllContentDetailExam(dataX);
  res.send(JSON.stringify(data));
});

router.route("/lastest_detail_exam/:typePage").get(async (req, res) => {
  var dataX = req.params.typePage;
  console.log("e.responseText", dataX);
  var data = await documentCtrl.getAllContentLatestExam(dataX);
  res.send(JSON.stringify(data));
});

router.route("/exam_group").post(async (req, res) => {
  var data = await documentCtrl.getAllInGroupExam(req);
  res.send(JSON.stringify(data));
});
router.route("/get_new").get(async (req, res) => {
  var data = await documentCtrl.getAllContentStartPage();
  res.send(JSON.stringify(data));
});

router.route("/get_advertisement").get(async (req, res) => {
  var data = await documentCtrl.getAllContentAdvertisement();
  res.send(JSON.stringify(data));
});

module.exports = router;
