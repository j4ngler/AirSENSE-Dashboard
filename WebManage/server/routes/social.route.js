const express = require('express');
const  socialCtrl = require('../controllers/social.controller.js');
const  iotCtrl = require('../controllers/iot.controller.js');


const isAuthenticated = require('../middlewares/authenticate.js');
const validate = require('../config/joi.validate.js');
const schema = require('../utils/validator.js');

const router = express.Router();

router.route('/check_email').post((req, res) => {
  socialCtrl.checkEmailRegister(req, res);
})
router.route('/gethome').get( (req, res) => socialCtrl.gethome(req, res));
router.route('/mainPages').post( (req, res) => socialCtrl.gethome(req, res));
router.route('/userdetail').post( (req, res) => socialCtrl.gethome(req, res));
router.route('/getThreshold').get( (req, res) => iotCtrl.getThreshhold(req, res));
router.route('/getdata').post( (req, res) => {
  iotCtrl.reportDataSensor(req, res)});

router.route('/getStation').get(isAuthenticated, (req, res) => iotCtrl.getStationServer(req, res));

router.route('/getStationHome').get( (req, res) => iotCtrl.getStationHome(req, res));
router.route('/getdatalimit').post(isAuthenticated, (req, res) => iotCtrl.reportDataStationLimit(req, res));
router.route('/getReportStations').post( (req, res) => {
  iotCtrl.getReportStations(req, res)
});
router.route('/getAbnormalData').post( (req, res) => iotCtrl.getAbnormalData(req, res));


router.route('/getTotalPosts').get( (req, res) => socialCtrl.getTotalPosts(req, res));
router.route('/getBlogsPagination').get( (req, res) => socialCtrl.getPostsPagination(req, res));
router.route('/getPosts').get( (req, res) => socialCtrl.getPosts(req, res));
router.route('/savePost').post( (req, res) => socialCtrl.savePost(req, res));


router.route('/getCurrentAQI').get( (req, res) => iotCtrl.getCurrentAQI(req, res));
router.route('/getAqiData').post( (req, res) => iotCtrl.getAqiData(req, res));//get aqi in recent 24h
router.route('/getDataRecent').post( (req, res) => iotCtrl.getDataRecent(req, res));






module.exports =  router;
