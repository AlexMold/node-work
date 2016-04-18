'use strict';

// Dependencies
const http        = require('http')
  	, koa         = require('koa')
  	, views       = require('koa-views')
  	, logger      = require('koa-logger')
  	, serve       = require('koa-static')
  	, bodyParser  = require('koa-bodyparser');

// Custom Koa middleware
const router = require('./routes/router');

// Create koa app
const app = koa();


app.use(function*(next){
	try {
		yield* next;
	} catch (err) {
		// Set response status & body
		this.status = err.status;
		this.body = {code: err.status, message: err.message};
	
		// Emit app-wide error
		this.app.emit('error', err, this);
	}
})

// Koa middleware
// app.use(error());
app.use(logger());
app.use(bodyParser());
app.use(serve('.'));

// Views middleware
app.use(views('views', {map:{html:'swig'}}));

// Define routes
router(app);

// Define configurable port
let port = process.env.PORT || 3000;

// Listen for connections
app.listen(port);

// Log port
console.log('Server listening on port ' + port);
