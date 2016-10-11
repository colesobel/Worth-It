var express = require('express');
var router = express.Router();
let Home = require('../models/home')

router.post('/getDailyAverage', function(req, res, next) {
    Home.getDailyAverage(req.body.user_id, req.body.currentMonth).then(averages => res.json(averages))
});

module.exports = router;
