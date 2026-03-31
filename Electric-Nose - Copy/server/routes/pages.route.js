const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Trang mặc định: chuyển thẳng vào dashboard e-nose cho tiện test
  return res.redirect('/enose');
});

// E-Nose dashboard page (dùng API /api/enose/*)
router.get('/enose', (req, res) => {
  res.render('enose/dashboard');
});

module.exports = router;

