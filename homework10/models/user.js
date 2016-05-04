const mongoose = require('mongoose');
const crypto = require('crypto');
const _ = require('lodash');
const config = require('config');

var userSchema = new mongoose.Schema({
  displayName:   {
    type:     String,
    required: "Имя пользователя отсутствует."
  },
  email:         {
    type:     String,
    unique:   true,
    required: "E-mail пользователя не должен быть пустым.",
    validate: [
      {
        validator: function checkEmail(value) {
          return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
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
    type: Date,
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

    this.salt = crypto.randomBytes(config.crypto.hash.length).toString('base64');
    this.passwordHash = crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations, config.crypto.hash.length);
  })
  .get(function() {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function(password) {
  if (!password) return false; // empty password means no login by password
  if (!this.passwordHash) return false; // this user does not have password (the line below would hang!)

  return crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations, config.crypto.hash.length) == this.passwordHash;
};

module.exports = mongoose.model('User', userSchema);

