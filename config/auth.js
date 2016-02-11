// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '725742960859069', // your App ID
        'clientSecret'  : '703be00e68d676697d9488b0d8deebc2', // your App Secret
        'callbackURL'   : 'http://localhost:8000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '992359180952-inq04tpnogu5eaqnlcroob31m0jcnfiu.apps.googleusercontent.com',
        'clientSecret'  : 'OwKozQD7qQBlr8VlMjPZMFfG',
        'callbackURL'   : 'http://localhost:8000/auth/google/callback'
    }

};