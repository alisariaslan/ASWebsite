//MODULES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var routes = require('./router/router');
var i18n = require('i18n');
var args = process.argv.slice(2);
var { now } = require('./date');
var path = require('path');

//LOCALIZATION
i18n.configure({
  locales: ['en', 'tr'],
  defaultLocale: 'en',
  directory: './public/locales',
  cookie: 'lang',
});

//ENGINE
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(i18n.init);

app.use(routes);

//START WEBSERVER
function start_http() {
  var server = app.listen(args[1], args[0], function () {
    console.log(now+'Web server started at -> http://%s:%s', args[0], args[1]);
  });
}

start_http();