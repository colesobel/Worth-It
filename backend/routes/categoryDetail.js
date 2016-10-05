var express = require('express');
var router = express.Router();
let CategoryDetail = require('../models/categoryDetail')


router.post('/getCategoryStats', function(req, res, next) {
  CategoryDetail.getStats(req.body.user_id, req.body.currentMonth, req.body.category).then(stats => {
    console.log(stats.rows[0]);
    res.json(stats.rows)
  })
});

module.exports = router;
