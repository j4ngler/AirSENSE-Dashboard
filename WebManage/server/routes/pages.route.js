const express = require("express");
const documentCtrl = require("../controllers/document.controller.js");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home/home", { route: "home" });
});

//register for customer and user
router.get("/customer_register", (req, res) => {
  res.render("authen/customer_register", { route: "register" });
});

router.get("/user_register", (req, res) => {
  res.render("authen/user_register", { route: "register" });
});


var arrayMenuPages = [
  {
    typePage: "Đào tạo",
    route: "tech",
    sideMenu: {},
  },

  {
    typePage: "Blog",
    route: "document",
    sideMenu: {},
  },
];

var arrayMenuCourse = [
  {
    typePage: "Maths",
    route: "course",
    sideMenu: {},
  },

  {
    typePage: "Physics",
    route: "course",
    sideMenu: {},
  },
];

var arrayMenuExam = [
  {
    typePage: "MathsTest",
    route: "exam",
    sideMenu: {},
  },

  {
    typePage: "PhysicsTest",
    route: "exam",
    sideMenu: {},
  },
];
router.get("/education/:typePage", async (req, res) => {
  var data = req.params.typePage;
  var itemvalue = ["head", "news", "documentary"];
  var index = itemvalue.findIndex((o) => o == data);
  var dataMAin = 10 + index;
  if (index < 10) {
    dataMAin = "11,12";
  }
  res.render("tech/tech", { detail: dataMAin, route: "tech" });
});

// router.get("/blog/:typePage", async (req, res) => {
//   var data = req.params.typePage;
//   var itemvalue = ["head", "stem", "environment", "climate"];
//   var index = itemvalue.findIndex((o) => o == data);
//   var dataMAin = index;
//   if (dataMAin < 1) {
//     dataMAin = "1,2,3";
//   }

//   res.render("document/blog", { detail: dataMAin, route: "document" });
// });

router.get("/blog/detail-blog/:id", async (req, res) => {
  var data = req.params.id;
  console.log(typeof data);
  if (data == 1) {
    res.render("document/blog-detail-1");
  } else if (data == 2) {
    res.render("document/blog-detail-2");
  } else if (data == 3) {
    res.render("document/blog-detail-3");
  }
});

router.get("/blog", async (req, res) => {
  res.render("document/blog");
});

router.get("/detail_page/:typePage", (req, res) => {
  var data = req.params.typePage;
  res.render("home/viewDetail", { detail: data, route: "tool" });
});

router.get("/group_page/:typePage", (req, res) => {
  var data = req.params.typePage;
  res.render("home/groupDetail", { detail: data, route: "tool" });
});

router.get("/register", (req, res) => {
  res.render("authen/register", { route: "register" });
});

// Course
router.get("/detail_lesson/:typePage", (req, res) => {
  var data = req.params.typePage;
  res.render("course/viewLesson", { detail: data, route: "course" });
});

router.get("/group_lesson/:typePage", (req, res) => {
  var data = req.params.typePage;
  res.render("course/viewCourse", { detail: data, route: "course" });
});
router.get("/course/:typePage", async (req, res) => {
  var data = req.params.typePage;
  var itemvalue = ["head", "maths", "physics", "english"];
  var index = itemvalue.findIndex((o) => o == data);
  var dataMAin = index;
  if (dataMAin < 1) {
    dataMAin = "1,2,3";
  }

  res.render("course/allCourse", { detail: dataMAin, route: "course" });
});

// Exam
router.get("/detail_exam/:typePage", (req, res) => {
  var data = req.params.typePage;
  res.render("exam/viewExam", { detail: data, route: "exam" });
});

router.get("/detail_exam_sp/:typePage", (req, res) => {
  var data = req.params.typePage;
  res.render("exam/viewExam1", { detail: data, route: "exam" });
});

router.get("/exam_group/:typePage", (req, res) => {
  var data = req.params.typePage;
  res.render("exam/viewGroupExam", { detail: data, route: "exam" });
});

router.get("/exam/maths/:typePage", async (req, res) => {
  var data = req.params.typePage;
  var itemvalue = ["head", "geometry", "algebra"];
  var index = itemvalue.findIndex((o) => o == data);
  var dataMAin = index;
  if (dataMAin < 1) {
    dataMAin = "1,2";
  }

  res.render("exam/allExam", { detail: dataMAin, route: "exam" });
});

router.get("/exam/physics/:typePage", async (req, res) => {
  var data = req.params.typePage;
  var itemvalue = ["head", "power", "volumn"];
  var index = itemvalue.findIndex((o) => o == data);
  var dataMAin = 10 + index;
  if (index < 10) {
    dataMAin = "11,12";
  }

  res.render("exam/allExam", { detail: dataMAin, route: "exam" });
});

router.get("/about", (req, res) => {
  res.render("home/about");
});

router.get("/map", (req, res) => {
  res.render("home/map");
});


router.get("/faq", (req, res) => {
  res.render("ManagerStation/reportStation");
});

router.get("/report_station", (req, res) => {
  res.render("ManagerStation/reportStation");
});


router.get("/test123", (req, res) => {
  res.render("old/Account/login");
});

// router.get('/comment', (req, res) => {
//   res.render('home/comment');
// })


/* commonSale */
router.get("/product", (req, res) => {
  res.render("sale/Sale");
});
router.get("/sale/product", (req, res) => {
  console.log("req /sale/product ", req._parsedOriginalUrl.query);
  res.render("sale/GroupProduct", { detail: req._parsedOriginalUrl.query });
});
router.get("/product/product_detail", (req, res) => {
  res.render("sale/DetailProduct", { detail: req._parsedOriginalUrl.query });
});
router.get("/sale/cart", (req, res) => {
  res.render("sale/invoiceInfoProduct");
});
router.get("/sale/finish", (req, res) => {
  res.render("sale/finishInvoiceProduct", {
    detail: req._parsedOriginalUrl.query,
  });
});
router.get("/sale/history", (req, res) => {
  res.render("sale/historyInvoice");
});
//Login 
router.get("/login/admin", (req, res) => {
  res.render("admin/admin");
});
router.get("/login/customer", (req, res) => {
  res.render("customer/customer");
});
router.get("/login/user", (req, res) => {
  res.render("authen/login");
});

router.get("/user_info", (req, res) => {
  res.render("user/userInfo");
})
module.exports = router;
