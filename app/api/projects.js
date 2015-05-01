var express = require('express');
var Project = require('../models/project');
var passport = require('passport');
var auth = require('./auth.js');

var router = express.Router();
router.route('/projects')
    // get project list
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
    // create new project
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

router.route('/projects/:id')
    // get single project
    .get(auth.isLoggedIn, function (req, res) {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.sendStatus(404);
        }

        Project.findById(req.params.id, function (err, project) {
            if (project.userId != req.user._id) {
                return res.sendStatus(401);
            }
            
            if (err) {
                return res.send(err);
            }

            if (!project) {
                return res.sendStatus(404);
            }

            res.json(project);
        });
    })
    // update single project
    .put(auth.isLoggedIn, function (req, res) {
        Project.findById(req.body._id, function (err, project) {
            if (project.userId != req.user._id) {
                return res.sendStatus(401);
            }

            project.name = req.body.name;

            project.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                res.json({ message: 'project updated' });
            });
        });
    })
    // delete project
    .delete(auth.isLoggedIn, function (req, res) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.sendStatus(404);
        }

        Project.findById(req.params.id, function (err, project) {
            if (err) {
                return res.send(err);
            }

            if (!project) {
                return res.sendStatus(404);
            }

            if (project.userId != req.user._id) {
                return res.sendStatus(401);
            }

            project.remove(function (err) {
                if (err) {
                    return res.send(err);
                }

                res.json({ message: 'project deleted' });
            });
        });
    });

module.exports = router;
