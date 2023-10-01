const express = require('express')
const router = express.Router();

//GET
router.get('/', function (req, res, next) { res.render('index'); });

// Custom 404 route
router.use((req, res, next) => {
    res.status(404).render('index', { message: "Sorry, the requested page couldn't be found!" });
  });

  
module.exports = router;