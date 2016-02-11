var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/profile', ensureAuthenticated, function(req, res, next) {
  res.render('profile', { user : req.user });
});


function ensureAuthenticated(req, res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}

module.exports = router;
