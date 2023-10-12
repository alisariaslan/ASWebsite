//MODULES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var args = process.argv.slice(2);
var { now } = require('./date');

//LOCALIZATION
var i18n = require('i18n');
i18n.configure({
  locales: ['en', 'tr'],
  defaultLocale: 'en',
  directory: './public/locales',
  cookie: 'lang',
  savemissing: 'false'
});
app.use(function (req, res, next) {
  i18n.init(req, res);
  i18n.setLocale(req.locale);
  next();
});
function getlocal(inputString) {
  return i18n.__(inputString);
}
module.exports = { getlocal };

//ENGINE
app.set('view engine', 'ejs');
app.use('/library', express.static('public'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//ROUTES
var routes = require('./router/router');
app.use(routes);

//START WEBSERVER
function start_http() {
  var server = app.listen(args[1], args[0], function () {
    console.log(now + 'Web server started at -> http://%s:%s', args[0], args[1]);
  });
}
start_http();