'use strict';

// Require user model
const User = require('../model/user');

module.exports = function *(id) {
  // Remove a user by ID
  yield User.remove({"_id": id});
  
  // Redirect to index
  this.redirect('/');
};