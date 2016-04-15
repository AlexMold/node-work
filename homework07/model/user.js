'use strict';

const mongoose = require('mongoose');
mongoose.set('debug', true);

mongoose.connect('mongodb://localhost/test', {
  server: {
    socketOptions: {
      keepAlive: 1
    },
    poolSize: 5
  }
});

// this schema can be reused in another schema
const userSchema = new mongoose.Schema({
  email:   {
    type:     String,
    required: true,
    unique:   true
  },
  created: {
    type:    Date,
    default: Date.now
  }
});


let User = mongoose.model('User', userSchema);

module.exports = User;
