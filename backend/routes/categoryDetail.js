var express = require('express');
var router = express.Router();
let CategoryDetail = require('../models/categoryDetail')


router.post('/getCategoryStats', function(req, res, next) {
  CategoryDetail.getStats(req.body.user_id, req.body.currentMonth, req.body.category).then(stats => res.json(stats.rows))
});


router.post('/getPurchaseHistory', function(req, res, next) {
  CategoryDetail.purchaseHistory(req.body.user_id, req.body.currentMonth, req.body.category).then(history => res.json(history.rows))
});


router.get('/purchaseHistory/:id', function(req, res, next) {
  CategoryDetail.deletePurchase(req.params.id).then(() => res.sendStatus(200))
});



module.exports = router;
