var express = require('express')
var router = express.Router();
var nodemailer = require('nodemailer');
var { myemail, mypassword } = require('.././config');
var { now } = require('.././date');
var fs = require('fs/promises');
var main = require('../main');
var iso6391 = require('iso-639-1');

// Create a transporter
var transporter = nodemailer.createTransport({
  host: '127.0.0.1',
  port: 25,
  secure: false,
  logger: false,
  debug: false,
  ignoreTLS: true, // add this 
  auth: {
    user: myemail,
    pass: mypassword
  }
});
transporter.verify((err, success) => {
  if (err) console.error(now + 'ERROR at Transporter config -> ' + err)
  else console.log(now + 'Transporter config is correct.');
});

router.get('/', function (req, res, next) {
  res.redirect('/index');
});

router.get('/mail_sent', function (req, res, next) { res.render('mail_sent'); });
router.get('/not_found', function (req, res, next) { res.render('not_found'); });

router.get('/index', async function (req, res, next) {
  try {
    var app_list = JSON.parse(await fs.readFile("db/apps.json", 'utf-8'));
    var statics = JSON.parse(await fs.readFile("db/statics.json", 'utf-8'));
    viewCount = statics.viewCount;
    viewCount++;
    const new_statics = {
      viewCount: viewCount
    };
    await fs.writeFile("db/statics.json", JSON.stringify(new_statics));
    let browser_lang = req.headers['accept-language'].split(',')[0]; // Tarayıcı dilini al
    res.render('index', { app_list, browser_lang, viewCount });
  } catch (error) {
    console.error("Error reading apps.json:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/library', async function (req, res, next) {
  try {
    var app_list = JSON.parse(await fs.readFile("db/apps.json", 'utf-8'));
    let browser_lang = req.headers['accept-language'].split(',')[0]; // Tarayıcı dilini al
    res.render('library', { app_list, browser_lang });
  } catch (error) {
    console.error("Error reading apps.json:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/library/:appKey', async function (req, res, next) {
  try {
    var app_list = JSON.parse(await fs.readFile("db/apps.json", 'utf-8'));
    var browser_lang = req.headers['accept-language'].split(',')[0]; // Tarayıcı dilini al
    var app = app_list.find(a => a.key === req.params.appKey);
    var langIndex = app['locales'].findIndex(l => l.key === browser_lang);
    if (langIndex < 0)
      langIndex = 0;

    var short_title = app['locales'][langIndex].short_title;
    var long_title = app['locales'][langIndex].long_title;
    var short_desc = app['locales'][langIndex].short_desc;
    var long_desc = app['locales'][langIndex].long_desc;
    var langs = app.supported_langs.split(',');
    var langNames = langs.map(code => iso6391.getName(code));
    var banner_icon = app.banner_icon;
    var resources = app.resources;

    res.render('app', { short_title, long_title, short_desc, long_desc, langNames, banner_icon, resources });
  } catch (error) {
    console.error("Error reading apps.json:", error);
    return res.status(404).redirect('/not_found');
  }
});

router.post('/form_submit', (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var subject = req.body.subject;
  var message = req.body.message;
  console.log(now + `Received form submission - Name: ${name}, Email: ${email}`);
  // Email to SENDER
  var mailOptions = {
    from: myemail,
    to: email,
    subject: 'Your message has reached me.',
    text: 'Thank you for contacting me. I will respond to your message as soon as possible. This is an automatic reply.',
  };
  // Email to ME
  var mailOptions2 = {
    from: email,
    to: myemail,
    subject: subject,
    text: message,
  };
  // Send email to SENDER
  /*
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(now + error.message);
    } else {
      console.log(now + 'Email sent: ' + info.response);
    }
  });
  */
  // Send email to ME
  transporter.sendMail(mailOptions2, (error, info) => {
    if (error) {
      console.error(now + error.message);
    } else {
      console.log(now + 'Email sent: ' + info.response);
    }
  });
  res.status(200).redirect('/mail_sent');
});

router.use((req, res, next) => {
  if (res.status(404))
    res.redirect('/not_found');
});

module.exports = router;