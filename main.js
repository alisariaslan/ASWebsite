//MODULES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var routes = require('./router/router');
var i18n = require('i18n');

//LOCALIZATION
i18n.configure({
  locales: ['en', 'tr'],
  defaultLocale: 'en',
  directory: './public/locales',
  cookie: 'locale',
  objectNotation: true,
});

//ENGINE
app.set('view engine', 'ejs');

//USE
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(i18n.init);

app.use((req, res, next) => {
  const userLang = req.headers['accept-language'];
  req.setLocale(userLang);
  next();
});

app.use(routes);

//DEFINITON FOR HOST AND PORT
var port = 10101;
var host = 'localhost';

//START WEBSERVER
function start_http() {
  var server = app.listen(port, host, function () {
    console.log('Web server started at -> http://%s:%s', host, port);
  });
}

start_http();