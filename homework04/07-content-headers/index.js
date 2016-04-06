
var koa = require('koa');

var app = module.exports = koa();

app.use(function* (next) {
  if(this.request.is('application/json') === "application/json"){
  	console.log("Test!");
  	this.response.type = "application/json";
  	this.response.body = {"message": "hi!"};
  	yield next;
  }else{
	this.response.type = "plain/text";
	this.response.body = "ok";
	}

  yield next;
});
