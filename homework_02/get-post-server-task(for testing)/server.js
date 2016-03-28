/**
 * Задача
 *
 * Написать сервер, который при
 *
 * GET /file
 * - выдаёт файл file из директории public,
 *   вместо file может быть любое имя файла
 * - ошибку 404 если файла нет
 *
 * POST /file
 * - пишет всё тело запроса в файл public/file и выдаёт ОК
 * - если файл уже есть, то выдаёт ошибку 409
 *
 * DELETE /file
 * - пишет всё тело запроса в файл public/file и выдаёт ОК
 * - если файл уже есть, то выдаёт ошибку 409
 *
 * Поддержка вложенных директорий в этой задаче не нужна,
 * т.е. при наличии / или .. внутри пути сервер должен выдавать ошибку 400
 *
 * Параметры запроса, т.е. ? и после него нужно игнорировать
 * Эти запросы эквивалентны:  /my.png?123 и /my.png?abcd
 */

"use strict";

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_SIZE = 1000000000;

let server = http.createServer((req, res) => {

  let pathname = decodeURI(url.parse(req.url).pathname);
  let filename = pathname.slice(1); // /file.ext -> file.ext

  if (filename.includes('/') || filename.includes('..')) {
    res.statusCode = 400;
    res.end("Nested paths are not allowed");
    return;
  }

  if (req.method == 'GET') {
    if (pathname == '/') {
      // rewrite with streams and error handling (!)
      sendFile(__dirname + '/public/index.html', res);
    } else {

      let filepath = path.join(PUBLIC_DIR, filename);
      console.log(filepath);
      sendFile(filepath, res);
    }
  }


  if (req.method == 'POST') {

    if (!filename) {
      res.statusCode = 404;
      res.end("File not found");
    }

    receiveFile(path.join(PUBLIC_DIR, filename), req, res);

  }

  if (req.method == 'DELETE') {
    deleteFile(pathname, res);
  }

});


function receiveFile(filepath, req, res) {

  let size = 0;

  let writeStream = new fs.WriteStream(filepath, {flags: 'wx'});

  req
      .on('data', chunk => {
        size += chunk.length;

      if (size > MAX_SIZE) {
        res.statusCode = 413;
        res.end('Maximum upload file size exceeded');
        fs.unlink(filepath, function(err) {
          /* ignore error */
        });
        writeStream.destroy();
        }
      })
      .on('close', () => {
        writeStream.destroy();
        fs.unlink(filepath, (err) => { });
      })
      .pipe(writeStream);

  writeStream
      .on('error', function(err) {
        if (err.code == 'EEXIST' || err.code == 'ENOENT') {
          res.statusCode = 409;
          res.end("File exists");
        } else {
          console.error(err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.end("Internal error");
          } else {
            res.end();
          }
          fs.unlink(filepath, err => {});
        }

      })
    // finish = успешная запись
      .on('finish', () => res.end("OK"));
}

function sendFile(filepath, res) {
  let fileStream = fs.createReadStream(filepath);
  fileStream.pipe(res);

  fileStream
    .on('error', err => {
      if (err.code == 'ENOENT') {
      res.statusCode = 404;
      res.end("Not found");
    } else {
      console.error(err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end("Internal error");
      } else {
        res.end();
      }

    }
  })
    .on('open', () => {
      res.setHeader('Content-Type', mime.lookup(filepath));
    });

  res
    .on('close', () => {
      fileStream.destroy();
    });

}

function deleteFile(pathname, res){
  fs.unlink(`${__dirname}/public${pathname}`, (err) => {
    if (err) {

      if (err.code == 'ENOENT' || err.code == 'EEXIST') {
        res.statusCode = 404;
        res.end('File not exists');
        return;
      }

      console.log(err);
        res.statusCode = 500;
        res.end('Server error');
        return;
      }

    fs.readdir(`${__dirname}/public${pathname}`, (err, files) => {
      if (err) {
        res.statusCode = 200;
        res.end('OK')
        return;
      }

    res.statusCode = 200;
      res.end("Was deleted!!!");
    });

  return;
  });
}









//function deleteFile (pathname, res) {
//  pathname = path.join(config.filesDir, pathname);
//
//  fs.unlink(pathname, (err) => {
//    if (err) {
//
//    if (err.code == 'ENOENT') {
//      res.statusCode = 404;
//      res.end('File not exists');
//      return;
//    }
//
//    console.log(err);
//    res.statusCode = 500;
//    res.end('Server error');
//    return;
//  }
//
//  fs.readdir(config.filesDir, (err, files) => {
//    if (err) {
//    res.statusCode = 200;
//    res.end('OK')
//    return;
//  }
//
//  res.statusCode = 200;
//  res.end(JSON.stringify({files: files}));
//});
//
//return;
//})
//}










module.exports = server;