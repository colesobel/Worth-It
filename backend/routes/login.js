var express = require('express');
var router = express.Router();
let Login = require('../models/login')

router.post('/login', function(req, res, next) {
    Login.login(req.body).then(data => res.json(data))
});

router.post('/signup', function(req, res, next) {
    Login.signup(req.body).then((userId) => {
        if (userId) {
            Login.addDefaultExpenseCategories(userId.rows[0].id).then(() => res.json(userId.rows[0].id))
        } else {
            res.json(userId)
        }
    }).catch(e => console.log(e))
});

router.post('/getUserInfo', function(req, res, next) {
    Login.getUserInfo(req.body.user_id).then(name => res.json(name.rows[0]))
});



module.exports = router;
