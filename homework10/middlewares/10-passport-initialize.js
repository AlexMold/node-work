const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


passport.serializeUser(function(user, done) {
  done(null, user.id); // uses _id as idField
});

passport.deserializeUser(function(id, done) {
  User.findById(id, done); // callback version checks id validity automatically
});

// done(null, user)
// OR
// done(null, false, { message: <error message> })  <- 3rd arg format is from built-in messages of strategies
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user || !user.checkPassword(password)) {
        // don't say whether the user exists
        return done(null, false, { message: 'Нет такого пользователя или пароль неверен.' });
      }
      return done(null, user);
    });
  }
));

var passportInitialize = passport.initialize();

module.exports = function*(next) {
  Object.defineProperty(this, 'user', {
    get: function() {
      return this.req.user;
    }
  });

  yield passportInitialize.call(this, next);

};
