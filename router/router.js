var express = require('express')
var router = express.Router();
var nodemailer = require('nodemailer');
var { myemail, mypassword } = require('.././config');
var { now } = require('.././date');
var fs = require('fs/promises');
var main = require('../main');

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

//GET
router.get('/', function (req, res, next) {
  res.redirect('/index');
});
router.get('/index', async function (req, res, next) {
  let views = await fs.readFile("db.json", 'utf-8');
  views = JSON.parse(views);
  views.viewCount++;
  await fs.writeFile("db.json", JSON.stringify(views, null, 2));
  res.locals.viewCount = views.viewCount;
  res.render('index');
});

router.get('/mail_sent', function (req, res, next) { res.render('mail_sent'); });
router.get('/not_found', function (req, res, next) { res.render('not_found'); });
router.get('/library', function (req, res, next) { res.render('library'); });
router.get('/library/:appName', function (req, res, next) {
  const app_param = req.params.appName;
  var app_title = main.getlocal(app_param);
  var app_desc = main.getlocal(app_param + '_desc');
  var app_slangs = main.getlocal(app_param + '_langs')
  if (app_title === app_param || app_desc === app_param + '_desc'|| app_slangs === app_param + '_langs') {
    return res.status(404).redirect('/not_found');
  }
  var app_langs = app_slangs;
  res.render('app', { app_title, app_desc, app_param, app_langs });
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
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(now + error.message);
    } else {
      console.log(now + 'Email sent: ' + info.response);
    }
  });
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