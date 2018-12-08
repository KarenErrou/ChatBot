const fs = require('fs');

var split = [];

//for (var i=0; i<482; i++) {
var i, j, filenum=0, chunk=5;
for (i=0; i<482; i++) {

	var targets = fs.readFileSync('./'+i+'.json');
	targets = JSON.parse(targets);

	for (j=0; j<targets.length; j+=chunk) {

		var temparray = targets.slice(j,j+chunk);
		split.push(temparray);

		var f = './s'+filenum+'.json';
		fs.writeFileSync(f, JSON.stringify(temparray));
		filenum++;
	}
}
