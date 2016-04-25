'use strict';

const User = require('../model/user');

module.exports = function* () {
  // Render template
  let rst = yield User.find({});
  yield this.render('index', {users: rst});
};