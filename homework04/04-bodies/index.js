
var fs = require('fs');
var koa = require('koa');

var app = module.exports = koa();

/**
 * Create the `GET /stream` route that streams this file.
 * In node.js, the current file is available as a variable `__filename`.
 */

app.use(function* (next) {
	// let path = 
	var file = fs.createReadStream(__filename);
  if (this.request.path === '/stream') {
	  this.response.type = 'application/javascript';
	  this.response.body = file;
	}
	yield next;
});

/**
 * Create the `GET /json` route that sends `{message:'hello world'}`.
 */

app.use(function* (next) {
  if (this.request.path === '/json') {

	  this.response.type = 'application/json';
	  this.response.body = {
	  	"message": "hello world"
	  };
	}
	yield next;
});
