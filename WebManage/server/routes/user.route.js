const express = require('express');
const  userCtrl = require('../controllers/user.controller.js');
const isAuthenticated = require('../middlewares/authenticate.js');
const validate = require('../config/joi.validate.js');
const schema = require('../utils/validator.js');
const router = express.Router();

  router.route('/mqtt').post((req, res) => {
    userCtrl.mqtt(req, res);
  })


  router.route('/report').post(isAuthenticated, (req, res) => {
      userCtrl.getTableData(req, res);
  });
  router.route('/getChangeLog').post(isAuthenticated, (req, res) => {
    userCtrl.getDairyChange(req, res);
});

  router.route('/report-by-group').post(isAuthenticated, (req, res) => {
    userCtrl.getTableDataByGroup(req, res);
  });

  router.route('/report-page').post(isAuthenticated, (req, res) => {
    userCtrl.getNumberPages(req, res);
  });

  router.route('/manager_add').post(isAuthenticated, (req, res) => {
      userCtrl.addDataToTable(req, res);
  });
  router.route('/manager_delete').post(isAuthenticated, (req, res) => {
      userCtrl.deleteData(req, res);
  });  
  router.route('/manager_update').post(isAuthenticated, (req, res) => {
      userCtrl.updateData(req, res);
  });
  router.route('/fist_pages').post(isAuthenticated, (req, res) => {
    userCtrl.updateFistPages(req, res);
  });
  router.route('/fist_course').post(isAuthenticated, (req, res) => {
    userCtrl.updateFistCourse(req, res);
  });

  // comment

  router.route('/lst_user').get(isAuthenticated, (req, res) => {
    userCtrl.listUser(req, res);
  })

  

module.exports =  router;
