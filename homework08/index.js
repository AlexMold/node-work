'use strict';

// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
  require('./libs/trace');
}

var koa = require('koa');
var app = koa();

var config = require('config');
let mongoose = require('./libs/mongoose');

// keys for in-koa KeyGrip cookie signing (used in session, maybe other modules)
app.keys = [config.secret];

var path = require('path');
var fs = require('fs');
var middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach(function(middleware) {
  app.use(require('./middlewares/' + middleware));
});

// ---------------------------------------

// can be split into files too
var Router = require('koa-router');

var router = new Router({
  prefix: '/users'
});

var User = require('./libs/user');

router
  .param('userById', function*(id, next) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      this.throw(404);
    }

    this.userById = yield User.findById(id);

    if (!this.userById) {
      this.throw(404);
    }

    yield* next;
  })
  .post('/', function*(next) {
    let user = yield User.create({
      email: this.request.body.email
    });

    this.body = user.toObject();
  })
  .get('/:userById', function*(next) {
    this.body = this.userById.toObject();
  })
  .del('/:userById', function*(next) {
    yield this.userById.remove();
    this.body = 'ok';
  })
  .get('/', function*(next) {
    let users = yield User.find({}).lean();

    this.body = users;
  });


app.use(router.routes());

app.listen(3000);