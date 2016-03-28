/**
 ЗАДАЧА
 Написать HTTP-сервер для загрузки и получения файлов
 - Все файлы находятся в директории files
 - Структура файлов НЕ вложенная, поддиректорий нет

 - Виды запросов к серверу
   GET /file.ext
   - выдаёт файл file.ext из директории files,
   - ошибку 404 если файла нет

   POST /file.ext
   - пишет всё тело запроса в файл files/file.ext и выдаёт ОК
   - если файл уже есть, то выдаёт ошибку 409

   DELETE /file
   - удаляет файл
   - выводит 200 OK
   - если файла нет, то ошибка 404

 Вместо file может быть любое имя файла

 Поддержка вложенных директорий в этой задаче не нужна,
 т.е. при наличии / или .. внутри пути сервер должен выдавать ошибку 400
 */

'use strict';

let url   = require('url');
let fs    = require('fs');
let path  = require('path');

let mimeTypes = {
  '.js'   : 'text/javascript',
  '.html' : 'text/html',
  '.css'  : 'text/css',
  '.xml'  : 'text/xml',
  '.png'  : 'image/png',
  '.jpg'  : 'image/jpeg'
};

require('http').createServer( (req, res) => {

  let pathname = decodeURI( url.parse(req.url).pathname );
  let lookup = path.basename( decodeURI(req.url) ) || 'test.html';


  switch(req.method) {
    case 'GET':
      let headers = mimeTypes[path.extname(lookup)] + '; charset=utf-8';
      if (pathname == '/') {

        fs.readFile(`${__dirname}/public/index.html`, (err, data) => {
          if (err) throw err;

          res.setHeader('Content-Type', headers);
          res.end(data);
        });
        return;
      }

      if (pathname != '/' && pathname != '/favicon.ico') {
        let stream = new fs.createReadStream(`${__dirname}/files${pathname}`);
        fs.exists('files/' + pathname, exists => {
          if(exists){
            //fs.readFile(`${__dirname}/files${pathname}`, (err, data) => {
            //  if (err) throw err;
            //  res.setHeader('Content-Type', headers);
            //  res.end(data);
            //});
            stream.on('readable', () => {
              var dt = stream.read();
              res.end(dt);
            });
            return;
          }else{
            res.writeHead(404);
            res.end("No Such File!!! Sorry!");
          }
        });
          return;
      }


    case 'POST':

      if (pathname != '/favicon.ico' && pathname != '/') {

        req.on('data', function(data){
            //console.log(pathname);
          fs.exists(`files/${pathname}`, exists => {
            if(exists){
              res.writeHead(409);
              res.end("File already exists!!!");
            }
            return;
          });
          fs.writeFile(`${__dirname}/files${pathname}`, data, (err) => {
            if(err) throw err;
            res.writeHead(200);
            res.end(data);
          });
        });
        return;
      }

    case 'DELETE':

      if (pathname != '/favicon.ico' && pathname != '/') {
        fs.unlink(`${__dirname}/files${pathname}`, err => {
          if(err) {
            res.writeHead(404);
            res.end('No such File!!!');
          }else{
            res.writeHead(200);
            res.end("File was deleted!!!");
          }
        });
        return;
      }

    default:
      res.statusCode = 502;
      res.end("Not implemented");
  }

}).listen(3000);


//setTimeout();