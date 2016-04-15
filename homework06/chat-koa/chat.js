'use strict';

// need to finish '/publish' and '/subscribe'

const http = require('http');
const fs = require('mz/fs');
const url = require('url');
const path = require('path');
const logger = require('koa-logger')();
const app = require('koa')();
const Router = require('koa-router');
const clients = [];


app.use(logger);

app.use(function*(next) {

  try {
    yield* next;
  } catch (e) {
    if (e.status) { // User error
      this.body = e.message;
      this.status = e.status;
    } else { // Server error
      this.body = "Error 500";
      this.status = 500;
      console.error(e.message, e.stack);
    }

  }


});

let router = new Router();
let prom;

router
  .get('/', function* (next) {
    let indexFile = path.join(__dirname, 'index.html');
    let getIndexFile = fs.createReadStream(indexFile);
    this.type = 'html';
    this.body = getIndexFile;
  })
  .get('/subscribe', function* (next) {
    clients.push(this);

    this.body = yield new Promise(function(resolve, reject) {
      if(clients[0]['res']['finished']){
        resolve();
      }else{
        reject('bad');
      }
    })

    console.log(this.body);
  });

  router.post('/publish', function* (next) {
    let ct = '';
      this.req
        .on('data', function(data){
          ct += data;
        })
        .on('end', function(){
          clients[0]['response']['message'] = ct;
          clients[0]['res'].end();
          console.log(clients);
          this.body = ct;
        })
    //this.body = 'lol';
  });








app.use(router.routes());

app.listen(3000);














//const server = http.createServer(function(req, res) {
//
//  const urlPath = url.parse(req.url).pathname;
//
//  switch (req.method + ' ' + urlPath) {
//  case 'GET /':
//    res.setHeader('Content-Type', 'text/html; charset=utf-8');
//    sendFile("index.html", res);
//    break;
//
//  case 'GET /subscribe':
//
//    res.on('close', function() {
//      // console.log("subscribe - close");
//      clients.splice(clients.indexOf(res), 1);
//    });
//
//    clients.push(res);
//
//    console.log("subscribe", clients.length);
//
//    break;
//
//  case 'POST /publish':
//    // console.log("publish");
//    req.setEncoding('utf-8');
//
//    var body = '';
//
//    req
//      .on('data', function(data) {
//        // -----> размер body может быть слишком большим
//        body += data;
//
//        if (body.length > 512) { // маленькое значение важно для теста, т.к. end срабатывает
//          res.statusCode = 413;
//          res.end("Your message is too big for my little chat");
//        }
//      })
//      .on('end', function() {
//        // "end" triggers when all data consumed
//        // even if it's too big
//        if (res.statusCode == 413) return;
//
//        try {
//          body = JSON.parse(body);
//          if (!body.message) {
//            throw new SyntaxError("No message");
//          }
//          body.message = String(body.message);
//        } catch (e) {
//          res.statusCode = 400;
//          res.end("Bad Request");
//          return;
//        }
//
//        // console.log("publish '%s' to %d", body.message, clients.length);
//
//        // заметим: не может быть,
//        // чтобы в процессе этого цикла добавились новые соединения или закрылись текущие
//        clients.forEach(function(res) {
//          res.setHeader('Cache-Control', "no-cache, no-store, private");
//          res.end(body.message);
//        });
//
//        clients.length = 0;
//
//        res.end("ok");
//      });
//
//    break;
//
//  default:
//    res.statusCode = 404;
//    res.end("Not found");
//  }
//
//
//});
//
//// for tests if needed
//server._clients = clients;
//
//module.exports = server;
//
//function sendFile(fileName, res) {
//  var fileStream = fs.createReadStream(fileName);
//  fileStream
//    .on('error', function() {
//      res.statusCode = 500;
//      res.end("Server error");
//    })
//    .pipe(res)
//    .on('close', function() {
//      fileStream.destroy();
//    });
//}
