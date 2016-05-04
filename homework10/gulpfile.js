const config = require('config');
const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const runSequence = require('run-sequence');
const gp = require('gulp-load-plugins')();

const mongoose = require('./libs/mongoose');

process.on('uncaughtException', function(err) {
  console.error(err.message, err.stack, err.errors);
  process.exit(255);
});

gulp.task("nodemon", function(callback) {
  gp.nodemon({
    nodeArgs: ['--debug'],
    script:   "index.js"
    /* watch, ignore */
  });
});

gulp.task('db:load', require('./tasks/dbLoad'));


// when queue finished, close db
// orchestrator events (sic!)
gulp.on('stop', function() {
  mongoose.disconnect();
});

gulp.on('err', function(gulpErr) {
  if (gulpErr.err) {
    // cause
    console.error("Gulp error details", [gulpErr.err.message, gulpErr.err.stack, gulpErr.err.errors].filter(Boolean));
  }
  mongoose.disconnect();
});


