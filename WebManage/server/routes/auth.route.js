const express = require("express");
const authCtrl = require("../controllers/auth.controller.js");
const userCtrl = require("../controllers/user.controller");
const isAuthenticated = require("../middlewares/authenticate.js");
const isAuthenticateCustomer = require("../middlewares/authenticateCustomer.js");
const authenNewUser = require("../middlewares/authenNewUser.js");
const validate = require("../config/joi.validate.js");
const schema = require("../utils/validator.js");
const User = require("../models/database/user.model.js");
const Customer = require("../models/database/customer.model.js");
const router = express.Router();
const squel = require("squel");
const knex = require("../config/knex");
const permissionMappings = require('../utils/customerPermission.js');
const { login } = require("../controllers/auth.controller.js");
const customerCtrl = require("../controllers/customer.controller.js");
const { registerCustomer } = require("../controllers/customer.controller.js");

// authen
// login -> ok
// router.get('/login', (req, res) => {
//   res.render('authen/login', { route: 'login' });
// });

router.get("/giang", (req, res) => {
  res.render("authen/sendEmailForgotPass", { route: "register" });
});

// register new User 
router
  .route("/register")
  .post(validate(schema.register), authenNewUser, (req, res) => {
    userCtrl.registerUser(req, res);
  });

// router.get("/register", (req, res) => {
//   res.render("/authen/register");
// })


//change information for admin
router
  .route("/changeInfo")
  .put(validate(schema.updateInfoUser), isAuthenticated, (req, res) => {
    userCtrl.updateUser(req, res);
  });

// change information for customer

router
  .route("/changeInfoCustomer")
  .put(validate(schema.updateInfoUser), isAuthenticated, (req, res) => {
    userCtrl.updateUser(req, res);
  });

// change password
router
  .route("/changePassword")
  .put(validate(schema.changePassword), isAuthenticated, (req, res) => {
    userCtrl.changePassword(req, res);
  });

router.get("/resetPassword", (req, res) => {
  res.render("authen/resetPassword", { route: "resetPassword" });
});

router.get("/profile", (req, res) => {
  res.render("authen/updateInfo", { route: "updateInfomation" });
});

router.post("/logout", (req, res) => {
  authCtrl.logOut(req, res);
});

router.route("/login").post(validate(schema.login), (req, res) => {
  authCtrl.login(req, res);
});

router.route("/customer/login").post(validate(schema.login), (req, res) => {
  authCtrl.loginCustomer(req, res);
});

router
  .route("/resetPassword")
  .post(validate(schema.resetPassword), (req, res) => {
    userCtrl.resetPass(req, res);
  });

router
  .route("/newResetPass")
  .post(validate(schema.newResetPassword), (req, res) => {
    userCtrl.newResetPassword(req, res);
  });

router.route("/resetPassword/:id/:token").get((req, res) => {
  res.render("authen/updatePassword");
});

router.route("/user").get(isAuthenticated, (req, res) => {
  console.log("req.currentUser", req.currentUser);
  console.log(isAuthenticated);
  User.query({
    where: { user_id: req.currentUser.users_id },
    select: [
      "user_id",
      "username",
      "fullname",
      "phone_number",
      "email",
      "password",
      "address",
      "avatar",
      "permission_id",
    ],
  })
    .fetch({ require: false })
    .then((user) => {
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({ error: "No such user" });
      } else {
        res.status(200).json({
          user: user,
        });
      }
    });
});

router.route("/customer").get(isAuthenticateCustomer, (req, res) => {
  console.log("req.currentUser", req.currentUser);
  Customer.query({
    where: { customer_id: req.currentUser.customer_id },
    select: [
      "customer_id",
      "username",
      "fullname",
      "phone_number",
      "email",
      "address",
      "avatar",
      "contact",
    ],
  })
    .fetch({ require: false })
    .then(async (user) => {
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({ error: "No such user" });
      } 
      else {
        let customer = new Customer();
        const permissions = await customer.getPermissionCustomer(4);
        const customerSidebar = await permissionMappings.defineSideBar(permissions);
        res.status(200).json({
          user: user,
          permissions: permissions,
          sidebar: customerSidebar
        });
      }
    });
});


router.route('/permission').get( async (req, res) => {
  let customer = new Customer();
  const permissions = await customer.getPermissionCustomer(4);
  const customerSidebar = await permissionMappings.defineSideBar(permissions);
  res.status(200).json({
    permissions: permissions,
    sidebar: customerSidebar
  });
})

router.route("/getInfo").post((req, res) => {
  User.query({
    where: { userid: req.body.userid },
    select: ["userid", "name", "fullname", "avatar", "manifestid"],
  })
    .fetch({ require: false })
    .then((user) => {
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({ error: "No such user" });
      } else {
        res.status(200).json({
          user: user,
        });
      }
    });
});

router.route("/tocken").get(authCtrl.getTocken);

var tockenToCheck = [];

router.route("/generateTocken").post((req, res) => {
  /*if(req.action=="create"){
    tockenToCheck.push({tocken1:"sample1",tocken2:"sample2",time:new Date()});
  }
  else
  {
    let item=tockenToCheck.filter(function (i,n){
      return n.tocken1===tocken1;
    });
    if(!!item){
      tockenToCheck.push({tocken1:"sample1",tocken2:"sample2",time:new Date()});
    }
    
  }*/

  res.status(200).json({
    user: "user",
  });
});

// //register customer user
// router
//   .route("/customer_register")
//   .post(validate(schema.registerCustomer), async (req, res, next) => {
//     const fullname = req.body.fullName ? req.body.fullName : null;
//     const email = req.body.email ? req.body.email : null;
//     const phone_number = req.body.phoneNumber ? req.body.phoneNumber : null;
//     const username = req.body.userName ? req.body.userName : null;
//     const address = req.body.address ? req.body.address : null;
//     const password = req.body.password ? req.body.password : null;
//     const contact = req.body.contact ? req.body.contact : null;
//     const created_at = new Date();
//     const updated_at = new Date();
//     const id_created = 0;
//     const id_updated = 0;
//     const delete_flag = 0;
//     await knex
//       .raw("select * from customer where email= ?", [email])
//       .then(async (user) => {
//         if (user[0].length > 0) {
//           console.log('email ton tai');
//           return res.status(208).json({ message: "Email này đã tồn tại" });
//         } else {
//           await knex("customer")
//             .insert({
//               fullname,
//               email,
//               phone_number,
//               username,
//               address,
//               password,
//               contact,
//               created_at,
//               updated_at,
//               id_created,
//               id_updated,
//               delete_flag,
//             })
//             .then(() => {
//               console.log('check customer regis route')
//               return res.status(200).json({ message: "Đăng ký thành công" });
//             })
//             .catch((err) => {
//               console.error(err);
//               return res.status(500).json({
//                 success: false,
//                 message: "An error occurred, please try again later.",
//               });
//             });
//         }
//       });
//   });

router
  .route("/customer_register")
  .post(validate(schema.registerCustomer), authenNewUser, async (req, res, next) => {
    customerCtrl.registerCustomer(req, res);
  });

//reset password customer
router.route("/reset_password").post(authCtrl.resetPassword);
router.route("/new_password").post(authCtrl.newPassword);

module.exports = router;
