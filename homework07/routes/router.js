// Dependencies
var route = require('koa-route');

// Route definitions
module.exports = function router(app)
{
  // Set TODO routes
  app.use(route.get('/', require('./get')));
  app.use(route.get('/new', function* (){
  	yield this.render('new-user');
  }));
  // app.use(route.get('/todo/:id', require('./routes/show')));
  app.use(route.get('/user/delete/:id', require('./delete')));
  // app.use(route.get('/todo/edit/:id', require('./routes/edit')));
  app.use(route.post('/users', require('./post')));
  // app.use(route.post('/todo/update', require('./routes/update')));
};