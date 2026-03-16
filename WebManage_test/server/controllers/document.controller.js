const bookshelf = require("../config/bookshelf.js");
const HttpStatus = require("http-status-codes");
const DocumentFileAndFolder = require("../models/DocumentFileAndFolder.js");
const { returnFalse, returnOKCustom } = require("../utils/returnResponse");
const WarningInfo = require("../utils/warningInfo.js");
const { DEFINE_DOCUMENT, uploadFileS3 } = require("../models/S3UploadFile.js");
const pagesContent = require("../models/database/PagesContent.model.js");
var documentFileAndFolder = new DocumentFileAndFolder();
var squel = require("squel");
const knex = require("../config/knex.js");
var documentCtrl = {};
const urlHost =
  (process.env.APP_HOST || "localhost") + ":" + (process.env.APP_PORT || 3000);
async function queryInfoSql(sql, res = null) {
  try {
    var x = await knex
      .raw(sql)
      .then((rs) => {
        console.log("rs: ", result);
      })
      .catch((err) => {
        console.log("err>>>", err);
      });
    var data = [];
    console.log("x", x);
    if (x != null && x.length > 0) {
      data = x[0];
    }
    return data;
  } catch (ie) {
    if (res != null)
      returnFalse(
        res,
        "Can't  add file to server",
        WarningInfo.NOT_UPLOAD_FILE
      );
  }
}

documentCtrl.postAddPageToDataBase = function (request, res) {
  let content_html = request.body["content_html"];
  let group = request.body["group_file"];
  let content_sub_id = request.body["content_sub_id"];
  // save file
  var link = documentFileAndFolder.createNewfile(content_html, "storeHtml");
  if (link == null) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: true,
      data: { message: err.message },
    });
  } else {
    var addData = squel.insert().into("content_page");
    // save data Sql
    addData
      .set("content_sub_id", content_sub_id)
      .set("group_file", group)
      .set("file_save", link)
      .set("title", request.body["title"])
      .set("description", request.body["description"])
      .set("set_to_first", request.body["set_to_first"])
      .set("content_img", request.body["content_img"])
      .set(
        "id_created",
        request.currentUser.users_id || request.currentUser.customer_id
      )
      .set(
        "id_updated",
        request.currentUser.users_id || request.currentUser.customer_id
      )
      .set("created_at", "NOW()", { dontQuote: true })
      .set("updated_at", "NOW()", { dontQuote: true })
      .set("delete_flag", 0)
      .set("old_id", 0);
    knex
      .raw(addData.toString())
      .then(function (x) {
        return res.status(HttpStatus.OK).json({
          data: x,
        });
      })
      .catch(function (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: true,
          detail: err,
          data: "Database invalid",
        });
      });
  }
};

documentCtrl.postUpdatePageToDataBase = function (request, res) {
  let content_html = request.body["content_html"];
  let group = request.body["group_file"];
  let content_sub_id = request.body["content_sub_id"];
  // save file
  var link = documentFileAndFolder.createNewFile(content_html, "storeHtml");
  if (link == null) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: true,
      data: { message: err.message },
    });
  } else {
    var addData = squel.update().table("content_page");
    // save data Sql
    addData
      .set("content_sub_id", content_sub_id)
      .set("group_file", group)
      .set("file_save", link)
      .set("title", request.body["title"])
      .set("description", request.body["description"])
      .set("set_to_first", request.body["set_to_first"])
      .set("content_img", request.body["content_img"])
      .set("id_created", request.currentUser.users_id)
      .set("id_updated", request.currentUser.users_id)
      .set("updated_at", "NOW()", { dontQuote: true })
      .set("delete_flag", 0)
      .where("content_page_id=" + request.body["content_page_id"]);
    knex
      .raw(addData.toString())
      .then(function (x) {
        return res.status(HttpStatus.OK).json({
          data: x,
        });
      })
      .catch(function (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: true,
          detail: err,
          data: "Database invalid",
        });
      });
  }
};
async function saveDocumentFileHtml(res, content_html, dirSave) {
  try {
    console.log(content_html);
    var link = await documentFileAndFolder.createNewFileToS3(
      content_html,
      dirSave
    );
    link = await uploadFileS3("public/" + link, "", DEFINE_DOCUMENT.TYPE_HTML);
    if (link == null)
      returnFalse(res, "Can't add file to server", WarningInfo.NOT_UPLOAD_FILE);
    return link;
  } catch (ie) {
    console.log("ie,", ie);
    returnFalse(res, "Can't  add file to server", WarningInfo.NOT_UPLOAD_FILE);
    return null;
  }
}
documentCtrl.postAddProductPageToDataBase = async function (request, res) {
  console.log("request.body", request.body)
  let content_html = request.body["content_html"];
  let product_id = request.body["product_id"];
  var link = await saveDocumentFileHtml(res, content_html, "storeHtml");
  if (link != null) {
    var addData = squel.insert().into("product_spec");
    // save data Sql
    addData
      .set("product_id", product_id)
      .set("file_save", link)
      .set("id_created", request.currentUser.users_id)
      .set("id_updated", request.currentUser.users_id)
      .set("created_at", "NOW()", { dontQuote: true })
      .set("updated_at", "NOW()", { dontQuote: true })
      .set("delete_flag", 0)
      .set("old_id", 0);
    var x = await queryInfoSql(addData.toString(), res);
    return returnOKCustom(res, { data: x });
  }
};
// Document Course
documentCtrl.postAddCourseToDataBase = function (request, res) {
  let content = request.body["content"];
  let content_html = request.body["content_html"];
  let group = request.body["group_file"];
  let course_id = request.body["course_id"];
  // save file
  var link = documentFileAndFolder.createNewfile(content_html, "storeHtml");
  if (link == null) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: true,
      data: { message: err.message },
    });
  } else {
    var addData = squel.insert().into("course_page");
    // save data Sql
    addData
      .set("course_id", course_id)
      .set("group_file", group)
      .set("filesave", link)
      .set("title", request.body["title"])
      .set("content", request.body["content"])
      .set("is_main_pages_id", request.body["is_main_pages_id"])
      .set("content_img", request.body["content_img"])
      .set("id_created", request.currentUser.users_id)
      .set("id_updated", request.currentUser.users_id)
      .set("created_at", "NOW()", { dontQuote: true })
      .set("updated_at", "NOW()", { dontQuote: true })
      .set("deleteflag", 0);
    knex
      .raw(addData.toString())
      .then(function (x) {
        return res.status(HttpStatus.OK).json({
          data: x,
        });
      })
      .catch(function (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: true,
          detail: err,
          data: "Database inval",
        });
      });
  }
};

documentCtrl.postUpdateCourseToDataBase = function (request, res) {
  let content = request.body["content"];
  let content_html = request.body["content_html"];
  let group = request.body["group_file"];
  let course_id = request.body["course_id"];
  // save file
  var link = documentFileAndFolder.createNewfile(content_html, "storeHtml");
  if (link == null) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: true,
      data: { message: err.message },
    });
  } else {
    var addData = squel.update().table("course_page");
    // save data Sql
    addData
      .set("course_id", course_id)
      .set("group_file", group)
      .set("filesave", link)
      .set("title", request.body["title"])
      .set("content", request.body["content"])
      .set("is_main_pages_id", request.body["is_main_pages_id"])
      .set("content_img", request.body["content_img"])
      .set("id_created", request.currentUser.users_id)
      .set("id_updated", request.currentUser.users_id)
      .set("updated_at", "NOW()", { dontQuote: true })
      .set("deleteflag", 0)
      .where("content_page_id=" + request.body["course_page_id"]);
    knex
      .raw(addData.toString())
      .then(function (x) {
        return res.status(HttpStatus.OK).json({
          data: x,
        });
      })
      .catch(function (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: true,
          detail: err,
          data: "Database inval",
        });
      });
  }
};


// Exam
documentCtrl.postAddExamToDataBase = function (request, res) {
  let content = request.body["content"];
  let content_html = request.body["content_html"];
  let group = request.body["group_file"];
  let exam_id = request.body["exam_id"];
  // save file
  var link = documentFileAndFolder.createNewfile(content_html, "storeHtml");
  if (link == null) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: true,
      data: { message: err.message },
    });
  } else {
    var addData = squel.insert().into("exam_detail");
    // save data Sql
    addData
      .set("exam_id", exam_id)
      .set("group_file", group)
      .set("filesave", link)
      .set("title", request.body["title"])
      .set("content", request.body["content"])
      .set("is_main_pages_id", request.body["is_main_pages_id"])
      .set("content_img", request.body["content_img"])
      .set("id_created", request.currentUser.users_id)
      .set("id_updated", request.currentUser.users_id)
      .set("created_at", "NOW()", { dontQuote: true })
      .set("updated_at", "NOW()", { dontQuote: true })
      .set("deleteflag", 0);
    knex
      .raw(addData.toString())
      .then(function (x) {
        return res.status(HttpStatus.OK).json({
          data: x,
        });
      })
      .catch(function (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: true,
          detail: err,
          data: "Database inval",
        });
      });
  }
};

documentCtrl.postUpdateExamToDataBase = function (request, res) {
  let content = request.body["content"];
  let content_html = request.body["content_html"];
  let group = request.body["group_file"];
  let course_id = request.body["exam_id"];
  // save file
  var link = documentFileAndFolder.createNewfile(content_html, "storeHtml");
  if (link == null) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: true,
      data: { message: err.message },
    });
  } else {
    var addData = squel.update().table("exam_detail");
    // save data Sql
    addData
      .set("exam_id", exam_id)
      .set("group_file", group)
      .set("filesave", link)
      .set("title", request.body["title"])
      .set("content", request.body["content"])
      .set("is_main_pages_id", request.body["is_main_pages_id"])
      .set("content_img", request.body["content_img"])
      .set("id_created", request.currentUser.users_id)
      .set("id_updated", request.currentUser.users_id)
      .set("updated_at", "NOW()", { dontQuote: true })
      .set("deleteflag", 0)
      .where("exam_detail_id=" + request.body["exam_detail_id"]);
    knex
      .raw(addData.toString())
      .then(function (x) {
        return res.status(HttpStatus.OK).json({
          data: x,
        });
      })
      .catch(function (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: true,
          detail: err,
          data: "Database inval",
        });
      });
  }
};

//Advertisement

documentCtrl.postAddAdvertisementToDataBase = function (request, res) {
  let content = request.body["content"];
  let content_html = request.body["content_html"];
  let group = request.body["group_file"];
  let content_sub_id = request.body["content_sub_id"];
  // save file
  var link = documentFileAndFolder.createNewfile(content_html, "storeHtml");
  if (link == null) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: true,
      data: { message: err.message },
    });
  } else {
    var addData = squel.insert().into("advertisement_content");
    // save data Sql
    addData
      .set("content_sub_id", content_sub_id)
      .set("group_file", group)
      .set("filesave", link)
      .set("title", request.body["title"])
      .set("content", request.body["content"])
      .set("set_to_fist", 0)
      .set("content_img", request.body["content_img"])
      .set("id_created", request.currentUser.users_id)
      .set("id_updated", request.currentUser.users_id)
      .set("created_at", "NOW()", { dontQuote: true })
      .set("updated_at", "NOW()", { dontQuote: true })
      .set("deleteflag", 0);
    knex
      .raw(addData.toString())
      .then(function (x) {
        return res.status(HttpStatus.OK).json({
          data: x,
        });
      })
      .catch(function (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: true,
          detail: err,
          data: "Database inval",
        });
      });
  }
};

documentCtrl.postUpdateAdvertisementToDataBase = function (request, res) {
  let content = request.body["content"];
  let content_html = request.body["content_html"];
  let group = request.body["group_file"];
  let content_sub_id = request.body["content_sub_id"];
  // save file
  var link = documentFileAndFolder.createNewfile(content_html, "storeHtml");
  if (link == null) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: true,
      data: { message: err.message },
    });
  } else {
    var addData = squel.update().table("advertisement_content");
    // save data Sql
    addData
      .set("content_sub_id", content_sub_id)
      .set("group_file", group)
      .set("filesave", link)
      .set("title", request.body["title"])
      .set("content", request.body["content"])
      .set("set_to_fist", request.body["set_to_fist"])
      .set("content_img", request.body["content_img"])
      .set("id_created", request.currentUser.users_id)
      .set("id_updated", request.currentUser.users_id)
      .set("updated_at", "NOW()", { dontQuote: true })
      .set("delete_flag", 0)
      .where("advertisement_id=" + request.body["advertisement_id"]);
    knex
      .raw(addData.toString())
      .then(function (x) {
        return res.status(HttpStatus.OK).json({
          data: x,
        });
      })
      .catch(function (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: true,
          detail: err,
          data: "Database inval",
        });
      });
  }
};

//Blog

documentCtrl.getListBlog = async function () {
  const sqlString = squel
    .select()
    .from("content_page")
    .order("created_at", false)
    .where("delete_flag=0")
    .toString();
  console.log(sqlString)
  const data = await knex.raw(sqlString);
  if (data) {
    return data[0];
  }
  return [];
};

documentCtrl.getAllInMenuPage = async function (listID) {
  var sql =
    "SELECT content_page.*,content_sub.content_group , n FROM ( SELECT @prev := '', @n := 0 ) init JOIN ( SELECT content_page.*, @n := if(content_sub_id != @prev, 1, @n + 1) AS n, @prev := content_sub_id FROM content_page WHERE content_page.deleteflag =0 AND content_page.is_main_pages_id<1 and content_sub_id IN(" +
    listID +
    ") ORDER BY set_to_fist ,content_page_id DESC) content_page LEFT JOIN content_sub on content_sub.content_sub_id=content_page.content_sub_id WHERE n <= 2 ";

  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    var subjects = [];
    var idItem = -1;
    for (var i = 0; i < x[0].length; i++) {
      var itemPage = x[0][i];
      if (!!itemPage) {
        console.log(
          "documentCtrl.getAllInMenuPage  .......>.",
          itemPage.content_sub_id
        );
        if (itemPage.content_sub_id != idItem) {
          subjects.push({ title: itemPage.content_group, items: [] });
          idItem = itemPage.content_sub_id;
        }
        if (itemPage.is_main_pages_id == -1) {
          subjects[subjects.length - 1].items.push({
            title: itemPage.title,
            route: "/group_page/" + itemPage.content_page_id,
            typePage: itemPage.title,
          });
        } else {
          subjects[subjects.length - 1].items.push({
            title: itemPage.title,
            route: "/detail_page/" + itemPage.filesave.replace("/", "+"),
            typePage: itemPage.title,
          });
        }
      }
      console.log(
        "documentCtrl.getAllInMenuPage  itemPageitemPage.content_sub_id",
        i,
        x[0].length
      );
    }
    console.log("documentCtrl.getAllInMenuPage subjects", subjects);
    return subjects;
  }
  return [];
};

documentCtrl.getAllContentDetailPage = async function (listID) {
  var sql =
    "SELECT content_page.*,content_sub.content_group , n FROM ( SELECT @prev := '', @n := 0 ) init JOIN ( SELECT content_page.*, @n := if(content_sub_id != @prev, 1, @n + 1) AS n, @prev := content_sub_id FROM content_page WHERE content_page.deleteflag =0 AND content_page.is_main_pages_id<1  and content_sub_id IN(" +
    listID +
    ") ORDER BY set_to_fist ,content_page_id DESC) content_page LEFT JOIN content_sub on content_sub.content_sub_id=content_page.content_sub_id WHERE n <= 10 ";

  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    return x[0];
  }
  return [];
};

// Course
documentCtrl.getAllContentDetailCourse = async function (listID) {
  var sql =
    "SELECT course_page.*,course.course_group , n FROM ( SELECT @prev := '', @n := 0 ) init JOIN ( SELECT course_page.*, @n := if(course_id != @prev, 1, @n + 1) AS n, @prev := course_id FROM course_page WHERE course_page.deleteflag=0 AND course_page.is_main_pages_id<1  and course_id IN(" +
    listID +
    ") ORDER BY set_to_fist ,course_page_id DESC) course_page LEFT JOIN course on course.course_id=course_page.course_id WHERE n <= 10 ";

  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    return x[0];
  }
  return [];
};

// Exam
documentCtrl.getAllContentDetailExam = async function (listID) {
  var sql =
    "SELECT exam_detail.*,exam.exam_group , n FROM ( SELECT @prev := '', @n := 0 ) init JOIN ( SELECT exam_detail.*, @n := if(exam_id != @prev, 1, @n + 1) AS n, @prev := exam_id FROM exam_detail WHERE exam_detail.deleteflag=0 AND exam_detail.is_main_pages_id<1  and exam_id IN(" +
    listID +
    ") ORDER BY set_to_fist ,exam_detail_id DESC) exam_detail LEFT JOIN exam on exam.exam_id=exam_detail.exam_id WHERE n <= 10 ";

  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    return x[0];
  }
  return [];
};

documentCtrl.getAllContentLatestPage = async function (listID) {
  var sql =
    "SELECT content_page.*,content_sub.content_group , n FROM ( SELECT @prev := '', @n := 0 ) init JOIN ( SELECT content_page.*, @n := if(content_sub_id != @prev, 1, @n + 1) AS n, @prev := content_sub_id FROM content_page WHERE content_page.deleteflag =0 AND content_page.is_main_pages_id<1  and content_sub_id IN(" +
    listID +
    ") ORDER BY id_created DESC) content_page LEFT JOIN content_sub on content_sub.content_sub_id=content_page.content_sub_id WHERE n <= 10 ";

  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    return x[0];
  }
  return [];
};

// Course
documentCtrl.getAllContentLatestCourse = async function (listID) {
  var sql =
    "SELECT course_page.*,course.course_group , n FROM ( SELECT @prev := '', @n := 0 ) init JOIN ( SELECT course_page.*, @n := if(course_id != @prev, 1, @n + 1) AS n, @prev := course_id FROM course_page WHERE course_page.deleteflag =0 AND course_page.is_main_pages_id<1  and course_id IN(" +
    listID +
    ") ORDER BY id_created DESC) course_page LEFT JOIN course on course.course_id=course_page.course_id WHERE n <= 10 ";

  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    return x[0];
  }
  return [];
};

// Exam
documentCtrl.getAllContentLatestExam = async function (listID) {
  var sql =
    "SELECT exam_detail.*,exam.exam_group , n FROM ( SELECT @prev := '', @n := 0 ) init JOIN ( SELECT exam_detail.*, @n := if(exam_id != @prev, 1, @n + 1) AS n, @prev := exam_id FROM exam_detail WHERE exam_detail.deleteflag =0 AND exam_detail.is_main_pages_id<1  and exam_id IN(" +
    listID +
    ") ORDER BY id_created DESC) exam_detail LEFT JOIN exam on exam.exam_id=exam_detail.exam_id WHERE n <= 10 ";

  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    return x[0];
  }
  return [];
};

documentCtrl.getAllContentStartPage = async function () {
  var sql =
    "SELECT content_page.*,content_sub.content_group , n FROM ( SELECT @prev := '', @n := 0 ) init JOIN ( SELECT content_page.*, @n := if(content_sub_id != @prev, 1, @n + 1) AS n, @prev := content_sub_id FROM content_page WHERE content_page.deleteflag =0 AND content_page.is_main_pages_id<1 ORDER BY content_sub_id,set_to_fist,content_page_id DESC) content_page LEFT JOIN content_sub on content_sub.content_sub_id=content_page.content_sub_id WHERE n <= 2";
  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    for (var i = 0; i < x[0].length; i++) {
      x[0][i].filesave = x[0][i].filesave.replace("/", "+");
    }
    return x[0];
  }
  return [];
};

documentCtrl.getAllInGroupPage = async function (request) {
  console.log("sqlraw.toString() ........... request.body..", request.body);
  var is_main_pages_id = request.body["is_main_pages_id"];
  var sqlraw = squel
    .select()
    .from("content_page")
    .where("deleteflag=0")
    .where(
      "is_main_pages_id=" +
      is_main_pages_id +
      " OR content_page_id =" +
      is_main_pages_id
    );
  console.log("sqlraw.toString() .............", sqlraw.toString());
  var x = await knex.raw(sqlraw.toString());
  if (x != null && x.length > 0) {
    for (var i = 0; i < x[0].length; i++) {
      x[0][i].filesave = "/detail_page/" + x[0][i].filesave.replace("/", "+");
    }
    return x[0];
  }
  return [];
};

// Exam
documentCtrl.getAllInGroupExam = async function (request) {
  console.log("sqlraw.toString() ........... request.body..", request.body);
  var is_main_pages_id = request.body["is_main_pages_id"];
  var sqlraw = squel
    .select()
    .from("exam_detail")
    .where("deleteflag=0")
    .where(
      "is_main_pages_id=" +
      is_main_pages_id +
      " OR exam_detail_id =" +
      is_main_pages_id
    );
  console.log("sqlraw.toString() .............", sqlraw.toString());
  var x = await knex.raw(sqlraw.toString());
  if (x != null && x.length > 0) {
    for (var i = 0; i < x[0].length; i++) {
      x[0][i].filesave = "/detail_exam/" + x[0][i].filesave.replace("/", "+");
    }
    return x[0];
  }
  return [];
};

documentCtrl.getAllContentAdvertisement = async function () {
  var sql =
    " SELECT advertisement_content.*,content_sub.content_group , n FROM ( SELECT @prev := '', @n := 0 ) init JOIN ( SELECT advertisement_content.*, @n := if(content_sub_id != @prev, 1, @n + 1) AS n, @prev := content_sub_id FROM advertisement_content WHERE advertisement_content.deleteflag =0 ORDER BY set_to_fist ,advertisement_id DESC) advertisement_content LEFT JOIN content_sub on content_sub.content_sub_id=advertisement_content.content_sub_id WHERE n <= 1 ;";
  var x = await knex.raw(sql);
  if (x != null && x.length > 0) {
    return x[0];
  }
  return [];
};

module.exports = documentCtrl;
