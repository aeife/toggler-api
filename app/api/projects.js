var express = require('express');
var Project = require('../models/project');
var passport = require('passport');
var auth = require('./auth.js');

var router = express.Router();
router.route('/projects')
    .get(auth.isAuthenticated, function(req, res) {
        Project.find({ userId: req.user._id }, function(err, projects) {
            if (err) {
                res.send(err);
            }

            res.json(projects);
        });
    })
    .post(auth.isAuthenticated, function (req, res) {
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