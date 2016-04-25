'use strict';

// Require User model
const User = require('../model/user');

module.exports = function *() {
  // Parse input from request body
  var input = this.request.body;


  
  // Create new User Mongoose model
  var user = new User();
  
  // Set properties
  user.name = input.name;
  user.email = input.email;
  user.passwordHash = input.password;
  
  // Save in collection
  yield user.save();
  
  // Redirect to index
  this.redirect('/');
};