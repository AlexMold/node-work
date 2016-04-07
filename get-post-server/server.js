'use strict';

//const config = require('config');
//const fs = require('fs');
// const mime = require('mime');
//const http = require('http');

const fs = require("mz/fs");
const url = require('url');
const parse = require('co-busboy');
const path = require('path');
const logger = require("koa-logger");
const extname = path.extname;
const koa = require("koa");

const app = koa();



app.use(logger());

app.use(function* (next){
  yield* next;
  console.log("Done!!!");
});


app.use(getFile);
app.use(postFile);
app.use(deleteFile);






function* getFile(next){
  let filename = path.join(__dirname, "files", this.request.url);
  let indexFile = path.join(__dirname, "public", "index.html");
  let fstat = yield fs.stat(indexFile);

  if (fstat.isFile() && this.method === "GET") {
    if (this.request.url != "/") {
      this.type = extname(filename);
      this.body = fs.createReadStream(filename);
    } else {
      this.type = 'html';
      this.body = fs.createReadStream(indexFile);
    }
  };
  yield* next;
}


function* deleteFile(next){
  let filename = path.join(__dirname, "files", this.request.url);

  if (this.method === "DELETE") {
    let deleted = yield fs.unlink(filename);
    if(deleted){
      yield* next;
    }
    console.log(deleted);
  }
}


function* postFile(next){

  if ('POST' != this.method) return yield next;
  console.log(parse(this));
  //let filename = path.join(__dirname, "files");
  let parts = parse(this, {
    autoFields: true
  });
  let part;

  while (part = yield parts) {
    if(part.length){
      console.log('key: ' + part[0]);
      console.log('value: ' + part[1]);
    }else {
      let stream = fs.createWriteStream(__filename, {flags: 'wx'});
      part.pipe(stream)
        .on('error', this.onerror.bind(this));
      console.log('uploading %s -> %s', part.filename, stream.path);
    }
  }

  this.redirect('/');
}


app.listen(3000);

//function stat(file){
//	return function(cb){
//		fs.stat(file, cb);
//	}
//}


//module.exports = http.createServer((req, res) => {
//
//  let filename = decodeURI(url.parse(req.url).filename);
//  let filename = filename.slice(1); // /file.ext -> file.ext
//
//  if (filename.includes('/') || filename.includes('..')) {
//    res.statusCode = 400;
//    res.end("Nested paths are not allowed");
//    return;
//  }
//
//  if (req.method == 'GET') {
//    if (filename == '/') {
//      sendFile(config.get('publicRoot') + '/index.html', res);
//    } else {
//      let filepath = path.join(config.get('filesRoot'), filename);
//      sendFile(filepath, res);
//    }
//  }
//
//
//  if (req.method == 'POST') {
//
//    if (!filename) {
//      res.statusCode = 404;
//      res.end("File not found");
//    }
//
//    receiveFile(path.join(config.get('filesRoot'), filename), req, res);
//
//  }
//
//});
//
//
//function receiveFile(filepath, req, res) {
//
//  let size = 0;
//
//  let writeStream = new fs.WriteStream(filepath, {flags: 'wx'});
//
//  req
//    .on('data', chunk => {
//      size += chunk.length;
//
//      if (size > config.get('limitFileSize')) {
//        res.statusCode = 413;
//        res.end('Maximum upload file size exceeded');
//        fs.unlink(filepath, function(err) {
//          /* ignore error */
//        });
//        writeStream.destroy();
//      }
//    })
//    .on('close', () => {
//      writeStream.destroy();
//      fs.unlink(filepath, err => { });
//    })
//    .pipe(writeStream);
//
//  writeStream
//    .on('error', function(err) {
//      if (err.code == 'EEXIST') {
//        res.statusCode = 409;
//        res.end("File exists");
//      } else {
//        console.error(err);
//        if (!res.headersSent) {
//          res.statusCode = 500;
//          res.end("Internal error");
//        } else {
//          res.end();
//        }
//        fs.unlink(filepath, err => {});
//      }
//
//    })
//    .on('close', function() {
//      // Note: can't use on('finish')
//      // finish = data flushed, for zero files happens immediately,
//      // even before "file exists" check
//
//      // for zero files the event sequence may be:
//      //   finish -> error
//
//      // we must use "close" event to track if the file has really been written down
//      res.end("OK");
//
//    });
//
//
//  /*
//  let emit = writeStream.emit;
//  writeStream.emit = function(event) {
//    console.log(event);
//    return emit.apply(this, arguments);
//  };
//  */
//
//}
//
//
//function sendFile(filepath, res) {
//  let fileStream = fs.createReadStream(filepath);
//  fileStream.pipe(res);
//
//  fileStream
//    .on('error', err => {
//      if (err.code == 'ENOENT') {
//        res.statusCode = 404;
//        res.end("Not found");
//      } else {
//        console.error(err);
//        if (!res.headersSent) {
//          res.statusCode = 500;
//          res.end("Internal error");
//        } else {
//          res.end();
//        }
//
//      }
//    })
//    .on('open', () => {
//      res.setHeader('Content-Type', mime.lookup(filepath));
//    });
//
//  res
//    .on('close', () => {
//      fileStream.destroy();
//    });
//
//}
