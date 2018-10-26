var arr = require('./movies.json');

var set = Array.from(new Set(arr));

const fs = require('fs');
fs.writeFile('./movies.json', JSON.stringify(set), 'utf8', (err)=>{
	if (err) throw err;
});

var movie_targets = require('./movie_targets.json');
var review_targets = require('./review_targets.json');

movie_targets.paths = set;
review_targets.paths = set;

fs.writeFile('./movie_targets.json', JSON.stringify(movie_targets), 'utf8', (err)=>{
	if (err) throw err;
});
fs.writeFile('./review_targets.json', JSON.stringify(review_targets), 'utf8', (err)=>{
	if (err) throw err;
});
