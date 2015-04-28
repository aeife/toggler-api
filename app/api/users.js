var express = require('express');
var User = require('../models/user');

var router = express.Router();
router.get('/users', function(req, res) {
    User.find(function(err, users) {
        if (err) {
            res.send(err);
        }

        res.json(users);
    });
});

module.exports = router;
