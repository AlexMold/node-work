'use strict';

const User = require('../model/user');

module.exports = function *(id) {

  let rst = yield User.findById(id);

  if(!rst){
    this.throw(404);
  }
  yield this.render('user-view', {user: rst});
}