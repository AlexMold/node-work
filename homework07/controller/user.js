'use strict';

const mongoose = require('mongoose');
const userModel = require('../model/user');


let mary = new userModel({
  email: 'mary@mail.com'
});

// // no error handling here (bad)
// userModel.remove({}, function(err) {

//   mary.save(function(err, result) {
//     console.log(result);

//     userModel.findOne({
//       email: 'mary@mail.com'
//     }, function(err, user) {
//       console.log(user);

//       mongoose.disconnect();
//     });

//   });

// });