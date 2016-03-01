// app/routes.js
module.exports = function(app, passport) {
    var db = require('monk')('localhost/xdose');
    var multer = require('multer');
    var upload = multer({dest:'public/images/uploads/'}); 
    var nodemailer = require('nodemailer');

    var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
        auth: {
            user: "christsam11326@gmail.com",
            pass: "preamraj"
        }   
    });

    app.post('/sendmail',function(req ,res){
        console.log('started\n\n');
        var transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "christsam11326@gmail.com",
                pass: "preamraj"
            }   
        });
        // console.log('transport layer is working\n\n');

        var mailOptions = {
            from: 'XDose Team'+req.user.google.name, // sender address
            to: 'shreyast15@gmail.com, ashishw270@gmail.com, ankitbaid11326@gmail.com, saleema.js@christuniversity.in', // list of receivers
            subject: 'xDose Testing', // Subject line
            text: 'Dear User, You have been challenged by'+req.user.google.name+'.Please Visit the Challenge room to accept or deny the challenge. Please Do note that there is a specific time period...So HURRY..!!', // plaintext body
        };
        // console.log('mailoption is created\n\n');
        // console.log(mailOptions);

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
        res.redirect('/profile');
        res.render('/profile');

    });


    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findOne({_id:id}, function (err, user) {
            done(err, user._id);
      });
    });

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        var posts = db.get('posts');
        posts.find({},{},function(err, posts){
            res.render('home',{
                "posts":posts
            });
        });
    });

     app.get('/challenge', function(req, res) {
        var users = db.get('users');
        users.find({},{},function(err, users){
            res.render('challenge',{
                "users":users
            });
        });
    });

    // =====================================
    // Testing page (with Index ) ========
    // =====================================
    app.get('/index', function(req, res) {
        var posts = db.get('posts');
        posts.find({},{},function(err, posts){
            console.log(posts);
            res.render('index',{
                "posts":posts
            });
        });
    });


    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('/', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('/', { message: req.flash('signupMessage') });
    });

    // for create account
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // // Just to render admin page
    // // so admin can manage homapage
    //  app.get('/admin', isLoggedIn, function(req, res) {
    //     res.render('admin', {
    //         user : req.user // get the user out of session and pass to template
    //     });
    // });



    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user // get the user out of session and pass to template
        });
    });


    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    // app.get('/upload', function(req, res) {
    app.get('/upload', function(req, res) {
        res.render('upload.html', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // SECURE ADDPOST  =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
     app.get('/addpost', isLoggedIn, function(req, res) {
        res.render('addpost', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));


    // =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // to get images from user posts

        var cpUpload = upload.fields([{ name :'bgimage1',maxCount:1},{ name :'bgimage2',maxCount:1},{ name :'bgimage3',maxCount:1},{ name :'bgimage4',maxCount:1},{ name :'bgimage5',maxCount:1},]);

        app.post('/upload',cpUpload, function(req, res){
            // console.log(req.user);    //uncomment this line after posts
            var title       = req.body.maintitle;
            var category    = req.body.my_select;
            var cover  = req.files[Object.keys(req.files)[0]];
            // var google_name      = req.user.google.email; //uncomment this line after posts
            // var facebook_name      = req.user.facebook.email; //uncomment this line after posts

            // ************************************************
            // Uncomment that section 
            // ************************************************


            // if(google_name != undefined && facebook_name == undefined)
            //     name = google_name;
            // else if(google_name == undefined && facebook_name != undefined)
            //     name =facebook_name;
            // else name = "something";
            var name = "Polkacafe.com"
            var arr = [];

            var json = {};
            for(var i=0,j=2; i<10; i++,j=j+2){
                var file = req.files[Object.keys(req.files)[i]];
                var subtitle = req.body[Object.keys(req.body)[j]];
                var content = req.body[Object.keys(req.body)[j+1]];
                    var temp_obj = {};
                        temp_obj['subtitle'] = subtitle;
                        temp_obj['content'] = content;
                        temp_obj['file'] = file;
                        arr.push(temp_obj);
            }                
                
            removeNulls(arr);
            console.log(arr);

            var posts = db.get('posts');
            // console.log(datauser);
            // SUBMIT TO DB
                    posts.insert({
                        "user":name,
                        "title":title,
                        "cover":cover,
                        "category":category,
                        "arr":arr
                    }, function(err, post){
                        if(err){
                            console.log(err);
                            res.send('There is an issue submiting the post');
                        } else {
                            console.log("success");
                            req.flash('Success','Post submitted');
                            res.location('/profile');
                            res.redirect('/profile');
                        }
                    });
            // res.end(JSON.stringify(req.files)+ "\n");
        });
    

    // SHOW POSTS based on user homepage
    app.get('/:id([0-9a-f]{24})',function(req, res, next){
    var posts = db.get('posts');
    posts.findById(req.params.id,function(err, post){
            res.render('content2',{
            "post": post
            });
        });
    });

    // Show posts based on category
    app.get('/:category', function(req, res, next){
    var posts = db.get('posts');
    posts.find({category: req.params.category}, {}, function(err, posts){
        res.render('content',{
            "title":req.params.category,
            "posts":posts
        });
    });
}) 

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

// Function to remove empty object from insert object to Database
function removeNulls(obj){
  var isArray = obj instanceof Array;
  for (var k in obj){
    if (obj[k]=== undefined  || obj[k] === "") isArray ? obj.splice(k,1) : delete obj[k];
    else if (typeof obj[k]=="object") removeNulls(obj[k]);
  }
}