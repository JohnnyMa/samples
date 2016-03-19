console.log('----------');
function test(path) {
	var getOVF = require("./getOvfContentFromOva.js");
	getOVF(path, function(content) {
		console.log('.ovf content.....');
		console.log(content);
		//var elem = document.getElementById('result');
		//elem.textContent = content;
	});
}

var path = '/home/jma/Downloads/node-v5.1.0-linux-x86.tar.gz';
//var path = 'D:/wamp/www/jtest/tar_fs/package.json';

console.log('----------===========' + path);
test(path);
console.log('----------===========');
