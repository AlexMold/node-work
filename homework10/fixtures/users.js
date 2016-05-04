var oid = require('../libs/db/oid');

require('../models/user');

exports.User = [{
  _id:         oid('user-mk'),
  displayName: "user 1",
  email:       "mk@javascript.ru",
  password:    "123456"
}, {
  _id:         oid('user-iliakan'),
  displayName: "user 2",
  email:       "iliakan@javascript.ru",
  password:    "123456"
}];
