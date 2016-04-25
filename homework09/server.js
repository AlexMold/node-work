'use strict';

// Dependencies
const http        = require('http'),
  		koa         = require('koa'),
  		views       = require('koa-views'),
  		logger      = require('koa-logger'),
  		serve       = require('koa-static'),
  		bodyParser  = require('koa-bodyparser');

// Custom Koa middleware
const router = require('./routes/router');

// Create koa app
const app = module.exports = koa();


app.use(function*(next){
	try {
		yield* next;
	} catch (e) {
		if (e.status) {
			// could use template methods to render error page
			this.body = e.message;
			this.statusCode = e.status;
		} else {
			this.body = "Error 500";
			this.statusCode = 500;
			console.error(e.message, e.stack);
		}

	}
})

// Koa middleware
// app.use(error());
app.use(logger());
app.use(bodyParser());
app.use(serve('.'));
app.use(require('./auth'));

// Views middleware
app.use(views('views', {map:{html:'swig'}}));

// Define routes
router(app);
