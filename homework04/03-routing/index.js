
var koa = require('koa');

var app = module.exports = koa();

app.use(function* (next) {
	if (this.request.path === "/") this.response.body = "hello world";
	yield next;
});

app.use(function* (next) {
	if (this.request.path === "/404") this.response.body = "page not found";
	yield next;
});

app.use(function* (next) {
	if (this.request.path === "/500") this.response.body = "internal server error";
	yield next;
});
