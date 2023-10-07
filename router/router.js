var express = require('express')
var router = express.Router();
var nodemailer = require('nodemailer');
const { myemail, mypassword } = require('.././config');
const { now } = require('.././date');

// Create a transporter
const transporter = nodemailer.createTransport({
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
  if (err) console.error(now+'ERROR at Transporter config -> '+err)
  else console.log(now+'Transporter config is correct.');
});

//GET
router.get('/', function (req, res, next) { res.render('index'); });

router.post('/message', (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var subject = req.body.subject;
  var message = req.body.message;

  console.log(now+`Received form submission - Name: ${name}, Email: ${email}`);

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
      console.error(now+error.message);
    } else {
      console.log(now+'Email sent: ' + info.response);
    }
  });

  // Send email to ME
  transporter.sendMail(mailOptions2, (error, info) => {
    if (error) {
      console.error(now+ error.message);
    } else {
      console.log(now+'Email sent: ' + info.response);
    }
  });

  res.render('index', { message: "Your message sent succesfully." });
});


// Custom 404 route
router.use((req, res, next) => {
  res.status(404).render('index', { message: "Sorry, the requested page couldn't be found!" });
});

module.exports = router;