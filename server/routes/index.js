var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'pook.io' });
});

router.get('/firebase', function(req, res) {
	res.render('firebase', { title: 'Fireplay'});
});

router.get('/polymer', function(req, res) {;
  res.render('polymer', {title: 'Polyplay'});
});
module.exports = router;
