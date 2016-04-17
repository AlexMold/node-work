// Require todo model
var User = require('../model/user');

module.exports = function *() {
  // Parse input from request body
  var input = this.request.body;
  
  // Get current date
  var creationDate = new Date();
  
  // Create new todo Mongoose model
  var user = new User();
  
  // Set properties
  user.name = input.name;
  user.email = input.email;
  user.created = creationDate;
  // user.updated_on = creationDate;
  
  // Save in collection
  yield user.save();
  
  // Redirect to index
  this.redirect('/');
};