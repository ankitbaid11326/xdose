// app.js

// set up ======================================================================
// get all the tools we need
var express = require('express')
  , path = require('path')
  , cons = require('consolidate')
  , app = express()
  , dust = require('dustjs-linkedin');
var port     = process.env.PORT || 8000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var expressValidator = require('express-validator');
var morgan       = require('morgan');
// var multer = require('multer');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var multipart = require('connect-multiparty');
var db = require('monk')('localhost/xdose');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect('mongodb://localhost/xdose');// connect to our database
require('./config/passport')(passport); // pass passport for configuration

// assign the swig engine to .html files 
app.engine('html', cons.dust);
app.set('views', __dirname + '/views');

// To add all necessary files in the pages
// That is css and js files

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// To handle uploads 
// app.use(multer({dest:'./public/uploads/'}).single('mainimage'));

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'html'); // set up ejs for templating

// required for passport
app.use(session({
	// secret: 'iloveit'
	secret: "hidden",
    key: 'asdasdasd', 
    cookie: { maxAge: 60000, secure: false },
    resave: true,
    saveUninitialized: false
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./models/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('Browser => localhost:' + port);

