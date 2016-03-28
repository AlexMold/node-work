'use strict';

let server = require('./../server');
let request = require('request');
let fs = require('fs');
require('should');

describe('Server http requests => ', function() {

    before(function(){
        server.listen(8080);
    });
    after(function(){
        server.close();
    });


    describe('GET requests', function() {

        it('get to / must be index.html', function(done) {
            request.get('http://localhost:8080', function (error, response, body) {
                if(error){
                    done(error);
                    return;
                }
                response.statusCode.should.equal(200);
                response.headers['content-type'].should.equal('text/html');

                done();
            })
        });

        it('get to /filename.ext', function(done) {
            request.get('http://localhost:8080/logo.png', function (error, response, body) {
                if(error){
                    done(error);
                    return;
                }
                response.statusCode.should.equal(200);
                response.headers['content-type'].should.equal('image/png');

                done();
            })
        });

        it('get to /not-exist-file.ext', function(done) {
            request.get('http://localhost:8080/lol.js', function (error, response, body) {
                if(error){
                    done(error);
                    return;
                }
                response.statusCode.should.equal(404);

                done();
            })
        });

    });



    describe('POST requests', function () {
        it('post some file', function (done) {
            //noinspection Eslint
            var formData = {
                // Pass a simple key-value pair
                my_field: 'my_value',
                // Pass data via Buffers
                my_buffer: new Buffer([1, 2, 3]),
                // Pass data via Streams
                my_file: fs.createReadStream(__dirname + '/server.spec.js'),
            };

            request.post({url:'http://localhost:8080', formData: formData}, function optionalCallback(err, res, body) {
                if (err) {
                    //console.error('upload failed:', err);
                    done(err);
                    return;
                }
                console.log('Upload successful!  Server responded with:', body);
            });

            done();
        })
    });



    describe('DELETE request', function() {

        it('must DELETE some file (but must be add file before to /public)', function(done) {
            request.del('http://localhost:8080/server.js', function (error, response, body) {
                if(error){
                    done(error);
                    return;
                }

              //console.log(Object.keys(response));
                response.statusCode.should.equal(200);

                done();
            })
        });

    });



});