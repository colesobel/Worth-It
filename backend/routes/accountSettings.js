var express = require('express');
var router = express.Router();
let AccountSettings = require('../models/accountSettings')

router.post('/getExpenseCategories', function(req, res, next) {
    AccountSettings.getExpenseCategories(req.body.user_id).then(categories => res.json(categories.rows))
});


router.post('/addExpenseCategories', function(req, res, next) {
    AccountSettings.addExpenseCategory(req.body.user_id, req.body.category).then(() => res.json('success'))
})


router.post('/deleteExpenseCategories', function(req, res, next) {
    AccountSettings.deleteExpenseCategory(req.body.user_id, req.body.category).then(() => res.json('success'))
})


router.post('/addFixedExpenses', function(req, res, next) {
    AccountSettings.addFixedExpenses(req.body).then(() => res.json('success'))
})

router.post('/getFixedExpenses', function(req, res, next) {
    AccountSettings.getFixedExpenses(req.body.user_id).then((fixedExpenses) => res.json(fixedExpenses.rows))
})


router.post('/enterIncome', function(req, res, next) {
    AccountSettings.enterIncome(req.body).then(() => res.json('sucess'))
})


router.post('/getIncome', function(req, res, next) {
    AccountSettings.getIncome(req.body.user_id).then(income => {
        income.rows[0] ?  res.json(income.rows[0].monthly_income) : res.json(false)        
    })
})


router.post('/updateIncome', function(req, res, next) {
    console.log(req.body)
    AccountSettings.updateIncome(req.body).then(income => res.json(req.body.income))
})


router.post('/updateExpenseCategories', function(req, res, next) {
    console.log(req.body)
    AccountSettings.updateExpenseCategories(req.body).then(() => res.json('success'))
})













module.exports = router;