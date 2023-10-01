// MODULES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var routes = require('./router/router');

// USE
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(routes);

//ENGINE
app.set('view engine', 'ejs');

// Port ve host değişkenlerini tanımla
var port = 10101;
var host = 'localhost';

// Web sunucusunu başlat
function start_http() {
  var server = app.listen(port, host, function () {
    console.log('Web server started at -> http://%s:%s', host, port);
  });
}

start_http();