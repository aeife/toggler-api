var express = require('express');
var User = require('../models/user');
var passport = require('passport');
var auth = require('./auth.js');

var router = express.Router();
router.route('/users')
    // .get(auth.isLoggedIn, function(req, res) {
    //     User.find(function(err, users) {
    //         if (err) {
    //             res.send(err);
    //         }
    //
    //         res.json(users);
    //     });
    // })
    // register new user
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

router.route('/users/session')
    // login
    .post(auth.isAuthLocal, function (req, res) {
        res.send(201, {message: 'good'});
    })
    // logout
    .delete(function (req, res) {
        req.logout();
        res.send({message: 'logged out'});
    });

router.route('/users/current')
    // fetch current user
    .get(auth.isLoggedIn, function (req, res) {
        User.findById(req.user._id, function(err, user) {
            if (err) {
                return res.send(err);
            }

            res.json(user);
        });
    })
    .put(auth.isLoggedIn, function (req, res) {
        User.findById(req.user._id).select('password').exec(function(err, user) {
            if (err) {
                return res.send(err);
            }

            user.verifyPassword(req.body.oldPassword, function (err, match) {
                if (err) {
                    return res.send(err);
                }

                if (!match) {
                    return res.sendStatus(401);
                }

                user.password = req.body.password || user.password;
                user.username = req.body.username || user.username;

                user.save(function (err) {
                    if (err) {
                        return res.send(err);
                    }

                    res.json({ message: 'user updated' });
                });
            });
        });
    });

module.exports = router;
