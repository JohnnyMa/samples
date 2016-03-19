module.exports = function getOvfContentFromOva(path, callback) {
/*
var browserify = require('browserify');
var b = browserify('example/main.js');
b.transform('brfs');

b.bundle().pipe(fs.createWriteStream('bundle.js'));
*/

	var tar = require('tar-fs');
	var fs = require('fs');
	//var fs = require('browserify-fs');
	var extract = tar.extract('./extract_folder');
	var result = '111test';

	extract.on('entry', function(header, stream, next) {
	  // read .ovf file only
	  if (header.name.indexOf('.ovf', header.name.length - '.ovf'.length) === -1) {
		  return false;
	  }
	  
	  stream.on('data', function(chunk) {
		//console.log('got %d bytes of data', chunk.length);
		if (0 === chunk.length) {
		  console.error('There is no content in the .ovf file.');
		} else {
			result = chunk.toString();
			callback(chunk.toString());
		}
		console.log(chunk.toString());
	  });
	  stream.resume() // just auto drain the stream
	});

	extract.on('finish', function() {
	  // all entries read
	  console.log('extract process is finished.');
	});

	console.log('fs-----');
	
	fs.createReadStream(path).pipe(extract);
	
	/*
	var file_exists = false;
	fs.exists(path, function (exists) {
	  file_exists = exists;
	  console.log(exists ? "it's there" : 'no passwd!');
	})

    if (file_exists){
		fs.createReadStream(path).pipe(extract);
	} else {
		console.log('file does not exist in: ' + path);
	}
	*/
}

