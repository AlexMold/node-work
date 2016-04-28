'use strict';

const server = require('./../server');
const request = require('request');
const mongoose = require('mongoose');
const userModel = require('../model/user');
require('should');


describe('Server http requests => ', function() {

  before(function(){
    server.listen(8080);
  });

  describe('GET requests', function() {

    it('get to / must be index.html', function(done) {
      request.get('http://localhost:8080', function (error, response, body) {
        if(error){
          done(error);
          return;
        }
        response.statusCode.should.equal(200);
        response.headers['content-type'].should.equal('text/html; charset=utf-8');
        done();
      })
    });

    it('get to /filename.ext', function(done) {
      request.get('http://localhost:8080/logo.png', function (error, response, body) {
        if(error){
          done(error);
          return;
        }
        response.statusCode.should.equal(404);
        done();
      })
    });
  });

});