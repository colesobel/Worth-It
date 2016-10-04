var express = require('express');
var router = express.Router();


router.post('/getCategoryStats', function(req, res, next) {
  console.log(req.body);
  res.json('get category stats hit')
});

module.exports = router;
