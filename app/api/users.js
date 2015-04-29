var express = require('express');
var User = require('../models/user');
var passport = require('passport');
var auth = require('./auth.js');

var router = express.Router();
router.route('/users')
    .get(auth.isLoggedIn, function(req, res) {
        User.find(function(err, users) {
            if (err) {
                res.send(err);
            }

            res.json(users);
        });
    })
    .post(function (req, res) {
        var user = new User({
            username: req.body.username,
            password: req.body.password
        });

        user.save(function(err) {
            if (err) {
                return res.send(err);
            }

            res.json({ message: 'user added' });
        });
    });

router.route('/users/login')
    .post(auth.isAuthLocal, function (req, res) {
        res.send({message: 'good'});
    });

router.route('/users/current')
    .get(auth.isLoggedIn, function (req, res) {
        console.log(req.user._id);
        User.find({ _id: req.user._id }, function(err, users) {
            if (err) {
                res.send(err);
            }

            res.json(users);
        });
    });

module.exports = router;
