//MODULES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var routes = require('./router/router');
var i18n = require('i18n');
var fs = require('fs/promises');
var args = process.argv.slice(2);

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

//LOCALIZATION
app.use((req, res, next) => {
  const userLang = req.headers['accept-language'];
  req.setLocale(userLang);
  next();
});

//VIEW COUNT
app.use(async (req, res, next) => {
  try {
    let views = await fs.readFile("db.json", 'utf-8');
    views = JSON.parse(views);
    views.viewCount++;
    await fs.writeFile("db.json", JSON.stringify(views, null, 2));
    res.locals.viewCount = views.viewCount;
    next();
  } catch (error) {
    next(error);
  }
});

app.use(routes);

//START WEBSERVER
function start_http() {
  var server = app.listen(args[1], args[0], function () {
    console.log('Web server started at -> http://%s:%s', args[0], args[1]);
  });
}

start_http();