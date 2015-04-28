var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();
router.get('/', function(req, res) {
    res.json({ message: 'working' });
});

app.use('/api/v1', router);

var port = process.env.PORT || 8080;
app.listen(port);
console.log('Server started on port ' + port);
