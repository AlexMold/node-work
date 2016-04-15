'use strict';

const http = require('http');
const fs = require('mz/fs');
const url = require('url');
const path = require('path');
const app = require('koa')();
const logger = require("koa-logger");
const busboy = require('co-busboy');
const router =require('koa-router')();

const clients = [];


app.use(logger());

app.use(function*(next){
  try{
    yield next;
  }catch(e){
    console.log(e);
    if(e.status){
      this.status = e.status;
      this.body = e.message;
    }else{
      this.status = 500;
      this.body = "Internal Server Error!!!";
    }
  }
})


router
  .get('/', function*() {
    let indexFile = path.join(__dirname, "index.html");
    this.type = 'html';
    this.body = fs.createReadStream(indexFile);
    console.log('Done!');
  })
  .get('/subscribe', function*() {
    // console.log(indexFile);
    this.res.on('close', function() {
      // console.log("subscribe - close");
      clients.splice(clients.indexOf(this.res), 1);
    });

    clients.push(this.res);

    console.log("subscribe", clients.length);
  })
  .post('/publish', function*() {


    this.req.setEncoding('utf-8');

    var bodyr = '';

    this.req
      .on('data', function(data) {
        // -----> размер body может быть слишком большим
        bodyr += data;
        // console.log(bodyr);
        if (bodyr.length > 512) { // маленькое значение важно для теста, т.к. end срабатывает
          this.status = 413;
          this.body = "Your message is too big for my little chat";
        }
      })
      .on('end', (dt) => {
        bodyr = JSON.parse(bodyr);
        console.log(bodyr.message);

        clients.forEach(function(res) {
          // res.setHeader('Cache-Control', "no-cache, no-store, private");
          res.end(bodyr.message);
        });

      })


      // this.body = bodyr;
        
        // try {
        //   bodyr = JSON.parse(bodyr);
        //   if (!bodyr.message) {
        //     throw new SyntaxError("No message");
        //   }
        //   bodyr.message = String(bodyr.message);
        // } catch (e) {
        //   this.res.statusCode = 400;
        //   this.res.end("Bad Request");
        //   return;
        // }
        // console.log("publish '%s' to %d", body.message, clients.length);
        // let self = this.response;
        // заметим: не может быть,
        // чтобы в процессе этого цикла добавились новые соединения или закрылись текущие
        // clients.forEach(function(res) {
        //   // this.res.setHeader('Cache-Control', "no-cache, no-store, private");
        //   res.end(bodyr.message);
        // });

        // clients.length = 0;

        this.body = bodyr;

  })

app
  .use(router.routes());


app.listen(3000);











































// const server = http.createServer(function(req, res) {

//   const urlPath = url.parse(req.url).pathname;

//   switch (req.method + ' ' + urlPath) {
//   case 'GET /':
//     res.setHeader('Content-Type', 'text/html; charset=utf-8');
//     sendFile("index.html", res);
//     break;

//   case 'GET /subscribe':
    
//     res.on('close', function() {
//       // console.log("subscribe - close");
//       clients.splice(clients.indexOf(res), 1);
//     });

//     clients.push(res);

//     console.log("subscribe", clients.length);

//     break;

//   case 'POST /publish':
//     // console.log("publish");
//     req.setEncoding('utf-8');

//     var body = '';

//     req
//       .on('data', function(data) {
//         // -----> размер body может быть слишком большим
//         body += data;

//         if (body.length > 512) { // маленькое значение важно для теста, т.к. end срабатывает
//           res.statusCode = 413;
//           res.end("Your message is too big for my little chat");
//         }
//       })
//       .on('end', function() {
//         // "end" triggers when all data consumed
//         // even if it's too big
//         if (res.statusCode == 413) return;
        
//         try {
//           body = JSON.parse(body);
//           if (!body.message) {
//             throw new SyntaxError("No message");
//           }
//           body.message = String(body.message);
//         } catch (e) {
//           res.statusCode = 400;
//           res.end("Bad Request");
//           return;
//         }

//         // console.log("publish '%s' to %d", body.message, clients.length);

//         // заметим: не может быть,
//         // чтобы в процессе этого цикла добавились новые соединения или закрылись текущие
//         clients.forEach(function(res) {
//           res.setHeader('Cache-Control', "no-cache, no-store, private");
//           res.end(body.message);
//         });

//         clients.length = 0;

//         res.end("ok");
//       });

//     break;

//   default:
//     res.statusCode = 404;
//     res.end("Not found");
//   }


// });

// for tests if needed
// server._clients = clients;

// module.exports = server;

// function sendFile(fileName, res) {
//   var fileStream = fs.createReadStream(fileName);
//   fileStream
//     .on('error', function() {
//       res.statusCode = 500;
//       res.end("Server error");
//     })
//     .pipe(res)
//     .on('close', function() {
//       fileStream.destroy();
//     });
// }
