
var koa = require('koa');
var escape = require('escape-html');

var app = module.exports = koa();

app.use(function* (next) {
  yield next;
  console.log(escape(this.response.body));
})

app.use(function* body(next) {
  this.response.body = escape('this following HTML should be escaped: <p>hi!</p>');
});
