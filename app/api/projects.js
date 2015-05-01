var express = require('express');
var Project = require('../models/project');
var passport = require('passport');
var auth = require('./auth.js');

var router = express.Router();
router.route('/projects')
    .get(auth.isLoggedIn, function(req, res) {
        Project
            .find({ userId: req.user._id })
            .limit(req.query.limit)
            .skip(req.query.offset)
            .exec(function(err, projects) {
                if (err) {
                    res.send(err);
                }

                Project.count(function (err, count) {
                    if (err) {
                        res.send(err);
                    }

                    res.json({
                        projects: projects,
                        limit: req.query.limit,
                        offset: req.query.offset,
                        count: count
                    });
                });
            });
    })
    .post(auth.isLoggedIn, function (req, res) {
        var project = new Project({
            name: req.body.name,
            userId: req.user._id
        });

        project.save(function(err) {
            if (err) {
                return res.send(err);
            }

            res.json({ message: 'project added' });
        });
    });

module.exports = router;
