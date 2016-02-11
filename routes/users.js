var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var User = require('../models/user');


// GOOGLE CLIENT ID AND SECRET
var GOOGLE_CLIENT_ID      = "992359180952-inq04tpnogu5eaqnlcroob31m0jcnfiu.apps.googleusercontent.com"
  , GOOGLE_CLIENT_SECRET  = "OwKozQD7qQBlr8VlMjPZMFfG";

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// router.get('/register', function(req, res, next) {
//   res.render('register',{
//   	'title': 'Register'
//   });
// });

// router.get('/login', function(req, res, next) {
//   res.render('login',{
//   	'title': 'Login'
//   });
// });

router.post('/register', function(req, res, next){
	// Get the Form values
	var name 		= req.body.name;
	var city 		= req.body.city;
	var job 		= req.body.job;
	var dob 		= req.body.bday;
	var email 		= req.body.email;
	var sex 		= req.body.sex;
	var password 	= req.body.psw;
	var password2 	= req.body.psw2;

	req.checkBody('name','Name Field is Required').notEmpty();
	req.checkBody('city','City Field is Required').notEmpty();
	req.checkBody('email','Email is Not Valid').isEmail();
	req.checkBody('email','Email Field is Required').notEmpty();
	req.checkBody('job','Job Field is Required').notEmpty();
	req.checkBody('psw','Password Field is Required').notEmpty();
	req.checkBody('psw2','Password do not match').equals(req.body.psw);

	// CHECK FOR ERRORS
	var errors = req.validationErrors();

	if(errors){

		res.render('/', {
			 errors : errors,
			 name  : name,
			 email : email,
			 username: username,
			 username: username,
			 password: password,
			 password2: password
		});
	} else {
		var newUser = new User({
			name  : name,
			 email : email,
			 city: city,
			 dob: dob,
			 job: job,
			 sex: sex,
			 password:password,
			 // profileimage:profileImageName
		});

		// Create User
		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});
	}
	// Success Message
		req.flash('success','You are now registered and may login');

		res.location('/profile');
		res.redirect('/profile');
});

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.getUserById(id, function(err, user){
		done(err, user);	
	});	
});


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'psw',
    session: false
  },
  function(email, password, done){
		User.getUserByUsername(email, function(err, user){
			if(err) throw err;
			if(!user) {
				console.log('No user found with these details');
				return done(null, false,{message : 'Unknown User'});
			}

			console.log(user);

			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);
					console.log(user);
				} else{
					console.log('Invalid Password..!');
					return done(null, false, {message : 'Invalid Password'});
				}
			});
		});
	}
));


// code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))
    // code for twitter (use('twitter', new TwitterStrategy))

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
	clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/users/auth/google/callback",

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            // try to find the user based on their google id
            User.getUserById({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new google();

                    // set all of the relevant information
                    newUser.id    = profile.id;
                    newUser.token = token;
                    newUser.name  = profile.displayName;
                    newUser.email = profile.emails[0].value; // pull the first email
                    console.log('user is created');
                    console.log(newUser);
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    }));



// passport.use(new GoogleStrategy({
    // clientID:     GOOGLE_CLIENT_ID,
    // clientSecret: GOOGLE_CLIENT_SECRET,
    // callbackURL: "/users/auth/google/callback",
//     passReqToCallback   : true
//   },function(request, accessToken, refreshToken, profile, done) {
//     User.getUserById( profile , function (err, user) {
// 	    	if(err)
// 	    	{
// 	  			console.log(err);
// 	  		}
//   		  if (user) {

//                     // if a user is found, log them in
//                     console.log(user.id);
//                     console.log(user.name);
//                     return done(null, user);
//                 } else {
//                     // if the user isnt in our database, create a new user
//                     var newUser          = new User();

//                     // set all of the relevant information
//                     newUser.google.id    = profile.id;
//                     newUser.google.token = token;
//                     newUser.google.name  = profile.displayName;
//                     newUser.google.email = profile.emails[0].value; // pull the first email

//                     // save the user
//                     newUser.save(function(err) {
//                         if (err)
//                             throw err;
//                         return done(null, newUser);
//                     });
//                 }
//       // return done(err, user);
//     });
//   }
// ));


router.get('/auth/google',
  passport.authenticate('google', { scope: 
    [ 'https://www.googleapis.com/auth/plus.login',
    , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
));

router.get( '/auth/google/callback', 
    passport.authenticate( 'google', { 
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/',failureFlash: true }),
  function(req, res) {
  	console.log('successful login');
    res.status(200);
    res.redirect('/profile');
  });

router.get('/logout',function(req, res){
	req.logout();
	console.log('logout successful');
	req.flash('success','You have logged out');
	res.redirect('/');
});

module.exports = router;
