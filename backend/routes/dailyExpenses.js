'use strict'
var express = require('express');
var router = express.Router();
let dailyExpenses = require('../models/dailyExpenses')

router.post('/addExpense2', function(req, res, next) {
    req.body.expenseObj = JSON.parse(req.body.expenseObj)
    dailyExpenses.addExpense(req.body).then(() => res.json('add expense hit'))
});

router.post('/getGaugeStats', function(req, res, next) {
    dailyExpenses.getGaugeStats(req.body.user_id, req.body.currentMonth, req.body.year).then(gaugeStats => {
      res.json(gaugeStats)
    })
});

router.post('/getDailyAverages', function(req, res, next) {
    dailyExpenses.getDailyAverages(req.body.user_id, req.body.currentMonth).then(dailyAverages => res.json(dailyAverages.rows))
});


router.post('/getHeatmap', function(req, res, next) {
    dailyExpenses.getHeatmap(req.body).then(heatmap => res.json(heatmap.rows))
});





module.exports = router;
