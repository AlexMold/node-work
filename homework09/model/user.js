'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');
const _ = require('lodash');
mongoose.set('debug', true);

mongoose.connect('mongodb://localhost/auth', {
  server: {
    socketOptions: {
      keepAlive: 1
    },
    poolSize: 5
  }
});

// this schema can be reused in another schema
const userSchema = new mongoose.Schema({
  user: {
    type: String,
    required: 'No name found.'
  },
  email:   {
    type:     String,
    required: 'Must be introduced email',
    unique:   true,
    validate: [
      {
        validator: function checkEmail(value) {
          return this.deleted ? true : /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
        },
        msg:       'Укажите, пожалуйста, корректный email.'
      }
    ]
  },
  passwordHash:  {
    type: String,
    required: true
  },
  salt:          {
    required: true,
    type: String
  },
  created: {
    type:    Date,
    default: Date.now
  }
});

userSchema.virtual('password')
  .set(function(password) {

    if (password !== undefined) {
      if (password.length < 4) {
        this.invalidate('password', 'Пароль должен быть минимум 4 символа.');
      }
    }

    this._plainPassword = password;

    if (password) {
      this.salt = crypto.randomBytes(128).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 3, 128);
    } else {
      // remove password (unable to login w/ password any more, but can use providers)
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })
  .get(function() {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function(password) {
  if (!password) return false; // empty password means no login by password
  if (!this.passwordHash) return false; // this user does not have password (the line below would hang!)

  return crypto.pbkdf2Sync(password, this.salt, 3, 128) == this.passwordHash;
};


let user = mongoose.model('User', userSchema);

module.exports = user;
