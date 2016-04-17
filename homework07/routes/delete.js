// Require todo model
var User = require('../model/user');

module.exports = function *(id) {
  // Remove a todo by ID
  yield User.remove({"_id": id});
  
  // Redirect to index
  this.redirect('/');
};