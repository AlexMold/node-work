var user = require('../model/user');

module.exports = function *() {
  // Render template
  console.log(Object.keys(user.collection));
  yield this.render('index', user);
};