const express = require('express');
const enoseRoutes = require('./enose.route.js');

const router = express.Router();

// E-Nose API
router.use('/enose', enoseRoutes);

module.exports = router;

