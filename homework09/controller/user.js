'use strict';

const mongoose = require('mongoose');
const userModel = require('../model/user');


let mary = new userModel({
  email: 'mary@mail.com'
});