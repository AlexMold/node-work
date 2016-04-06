
var koa = require('koa');

var app = module.exports = koa();

app.use(function* errorHandler(next) {
  try {
  	yield next;

  } catch (err) {
    // your error handling logic goes here
    throw err;
  }
});

app.use(function* () {
	this.status = 500;
	this.body = "internal server error";
  // throw new Error('boom!');
});
