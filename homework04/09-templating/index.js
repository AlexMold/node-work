
var koa = require('koa');
var jade = require('jade');
var path = require('path');
var views = require("koa-views");

var app = module.exports = koa();


app.use(views(__dirname, {
  map: {
    html: 'jade'
  }
}));

app.use(function* () {
  var filename = path.join(__dirname, 'homepage.jade');
  this.render('homepage');
  yield next;
});
