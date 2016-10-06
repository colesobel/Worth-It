var express = require('express');
var router = express.Router();
let dailyExpenses = require('../models/dailyExpenses')

router.post('/addExpense', function(req, res, next) {
    dailyExpenses.addExpense(req.body).then(() => res.json('add expense hit'))
});

router.post('/getGaugeStats', function(req, res, next) {
    dailyExpenses.getGaugeStats(req.body.user_id, req.body.currentMonth).then(gaugeStats => {
      res.json(gaugeStats)
    })
});

router.post('/getDailyAverages', function(req, res, next) {
    dailyExpenses.getDailyAverages(req.body.user_id, req.body.currentMonth).then(dailyAverages => res.json(dailyAverages.rows))
});



module.exports = router;
