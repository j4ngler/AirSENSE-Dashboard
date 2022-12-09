const express = require('express');
const  authCtrl = require('../controllers/auth.controller.js');
const userCtrl = require('../controllers/user.controller');
const isAuthenticated = require('../middlewares/authenticate.js');
const isAuthenticateCustomer = require('../middlewares/authenticateCustomer.js');
const authenNewUser = require('../middlewares/authenNewUser.js');
const validate = require('../config/joi.validate.js');
const schema = require('../utils/validator.js');
const User = require('../models/database/user.model.js');
const Customer = require('../models/database/customer.model.js');
const router = express.Router();
const squel = require('squel');
const knex = require('../config/knex')

// authen
// login -> ok
// router.get('/login', (req, res) => {
//   res.render('authen/login', { route: 'login' });
// });


router.get('/giang', (req, res) => {
  res.render('authen/sendEmailForgotPass', { route: 'register' });
});


// note
router.route('/register').post(validate(schema.register), authenNewUser, (req, res) => {
  userCtrl.registerUser(req, res);
});

//change information for admin
router.route('/changeInfo').put(validate(schema.updateInfoUser), isAuthenticated, (req, res) => {  
  userCtrl.updateUser(req, res);
})

// change information for customer

router.route('/changeInfoCustomer').put(validate(schema.updateInfoUser), isAuthenticated, (req, res) => {  
  userCtrl.updateUser(req, res);
})


// change password

router.route('/changePassword').put(validate(schema.changePassword), isAuthenticated,(req, res) => {
userCtrl.changePassword(req, res);
})

router.get('/resetPassword', (req, res) => {
  res.render('authen/resetPassword', { route: 'resetPassword' });
});

router.get('/profile', (req, res) => {
  res.render('authen/updateInfo', { route: 'updateInfomation' });
});

router.post('/logout', (req, res) => {
  authCtrl.logOut(req, res);
});

router.route('/login').post(validate(schema.login), (req, res) => {
  authCtrl.login(req, res);
});

router.route('/customer/login').post(validate(schema.login), (req, res) => {
  authCtrl.loginCustomer(req, res);
});

router.route('/resetPassword').post(validate(schema.resetPassword), (req, res) => {
  userCtrl.resetPass(req, res);
});

router.route('/newResetPass').post(validate(schema.newResetPassword),(req, res) => {
  userCtrl.newResetPassword(req, res);
})

router.route('/resetPassword/:id/:token').get( (req, res) => {
  res.render('authen/updatePassword');
});



router.route('/user').get(isAuthenticated, (req, res) => {
  console.log("req.currentUser",req.currentUser)
  console.log(isAuthenticated);
  User.query({
    where: { userid: req.currentUser.users_id },
    select: [
      'user_id',
      'username',
      'fullname',
      'phone_number',
      'email',
      'password',
      'address',
      'avatar',
      'note',
      'permission_id'
    ],
  })
  .fetch({ require: false })
  .then((user) => {
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'No such user' });
      } else {
        res.status(200).json({
          user: user,
        });
      }
  });
});






// router.route('/customer').get(isAuthenticated, (req, res) => {
  router.route('/customer').get(isAuthenticateCustomer, (req, res) => {
    
  console.log("req.currentUser",req.currentUser)
  Customer.query({
    where: { customer_id: req.currentUser.customer_id },
    select: [
      'customer_id',
      'username',
      'fullname',
      'phone_number',
      'email',
      'address',
      'avatar',
      'contact',
    ],
  })
  .fetch({ require: false })
  .then((user) => {
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'No such user' });
      } else {
        res.status(200).json({
          user: user,
        });
      }
  });
});
router.route('/getInfo').post((req, res) => {
  User.query({
    where: { userid: req.body.userid },
    select: [
      'userid',
      'name',
      'fullname',
      'avartar',
      'manifestid'
    ],
  })
  .fetch({ require: false })
  .then((user) => {
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'No such user' });
      } else {
        res.status(200).json({
          user: user,
        });
      }
  });
  
})

router.route('/tocken').get( authCtrl.getTocken);


var tockenToCheck=[];

router.route('/generateTocken').post((req, res) => {
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

module.exports =  router;
