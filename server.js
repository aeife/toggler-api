var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var expressSession = require('express-session');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressSession({
    secret: 'toseggsslerion',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

var router = express.Router();
router.get('/', function(req, res) {
    res.json({ message: 'working' });
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');

var userApi = require('./app/api/users.js');
var projectApi = require('./app/api/projects.js');
app.use('/api/v1', router);
app.use('/api/v1', userApi);
app.use('/api/v1', projectApi);

var port = process.env.PORT || 8080;
app.listen(port);
console.log('Server started on port ' + port);
