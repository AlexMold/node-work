'use strict';
// ЗАДАЧА - сделать readFile, возвращающее promise
// 
 
const fs = require('mz/fs');

function readFiles(path, content){
	fs.readdir(path)
	.then((filenames) => {
		filenames.map((name) => {
			let len = 0;
			fs.readFile(path + name)
			.then(body => {
				len += body.length;
				console.log(len);
			})
			.catch(err => console.log(err.code));
			
		});
	}).catch(err => console.log(err.code));
	// console.log(len);
}

readFiles('/home/agribkov/workplace/get-post-server-task/');
 
// ЗАДАЧА - прочитать все файлы текущей директории, используя новый mz/fs
// (последовательно или параллельно - как считаете нужным)