var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

var router = express.Router();
router.get('/', function(req, res) {
    res.json({ message: 'working' });
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');

var userApi = require('./app/api/users.js');
app.use('/api/v1', router);
app.use('/api/v1', userApi);

var port = process.env.PORT || 8080;
app.listen(port);
console.log('Server started on port ' + port);
