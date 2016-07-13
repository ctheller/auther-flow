'use strict'; 

var app = require('express')();
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');

app.use(require('./logging.middleware'));

app.use(require('./request-state.middleware'));

app.use(flash());

var session = require('express-session');
var User = require('../api/users/user.model');

app.use(session({
  // this mandatory configuration ensures that session IDs are not predictable
  secret: 'tongiscool',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));

app.use(passport.initialize());
app.use(passport.session());

var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({where:{email: email}})
    .then(function(user) {
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log("worked!");
      return done(null, user);
    })
    .catch(function(err){
      return done(null, false, { message: 'Incorrect email.' })
    }
  )}
));


app.post('/login', 
  passport.authenticate('local', { successRedirect: '/auth/me',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);



app.post('/signup', function(req, res, next){
  User.create(req.body)
  .then(function(user){
    req.login(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/auth/me');
    });

  })
  .catch(next);
})

app.get('/logout', function(req, res, next){
  req.session.destroy()
})

// Google authentication and login 
app.get('/auth/google', passport.authenticate('google', { scope : 'email' }));

// handle the callback after Google has authenticated the user
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/', // or wherever
    failureRedirect : '/login/' // or wherever
  })
);

// don't forget to install passport-google-oauth
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(
  new GoogleStrategy({
    clientID: '803939796453-2j0k23hsgn62vr4gg6q1eou07e385vju.apps.googleusercontent.com',
    clientSecret: 'W51C3aHTul_l_7__26K5IgqK',
    callbackURL: '/auth/google/callback'
  },
  // Google will send back the token and profile
  function (token, refreshToken, profile, done) {
    // the callback will pass back user profile information and each service (Facebook, Twitter, and Google) will pass it back a different way. Passport standardizes the information that comes back in its profile object.
    var info = {
      name: profile.displayName,
      email: profile.emails[0].value,
      photo: profile.photos ? profile.photos[0].value : undefined
    };
    User.findOrCreate({
      where: {googleId: profile.id},
      defaults: info
    })
    .spread(function (user) {
      //spread because an array is returned
      done(null, user);
    })
    .catch(done);
  })
);

passport.serializeUser(function (user, done) {
  done(null,user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
  .then(function (user) {
    done(null, user);
  })
  .catch(done);
});

app.use(function (req, res, next) {
  console.log('Session User:', session);
  next();
});

app.get('/auth/me', function(req, res, next){
  if (!req.user) return res.send(undefined);
  User.findOne({where: {id: req.user.id}})
  .then(function(user){
    if (!user) return res.sendStatus(401);
    user.password = null;
    res.status(200);
    res.json(user);
  })
  .catch(next);
})

app.use('/api', require('../api/api.router'));

app.use(require('./statics.middleware'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./error.middleware'));

module.exports = app;
