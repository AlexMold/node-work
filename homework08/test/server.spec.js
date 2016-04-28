'use strict';

const server = require('../index');
const request = require('request');
const mongoose = require('mongoose');
const userModel = require('../libs/user');
require('should');


describe('Server http requests => ', function() {

  before(function(){
    server.listen(8080);
  });

  describe('GET requests', function() {

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