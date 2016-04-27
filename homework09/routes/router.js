'use strict';

// Dependencies
const route = require('koa-route');

// Route definitions
module.exports = function router(app)
{
  // Set User Routes
  app.use(route.get('/', require('./get')));
  app.use(route.get('/user/:id', require('./show-user')));
  app.use(route.get('/user/delete/:id', require('./delete')));
  app.use(route.get('/new', function *(){
  	yield this.render('new-user');
  }));
  app.use(route.post('/users', require('./post')));

};