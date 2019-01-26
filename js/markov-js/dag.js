var graph = {
	start: [],
	words: {},
	end: []
};

function addNode(word) {

	if (!graph.words.hasOwnProperty(word)) {
		graph.words[word] = {};
	}
}

function addEdge(word1, word2) {

	if (!graph.words[word1].hasOwnProperty(word2)) {
		graph.words[word1][word2] = 1;
	} else {
		graph.words[word1][word2]++;
	}
}

function endOfSentence(word) {
	
	switch (word.substring(word.length-1)) {
	
		case "?":
		case "!":
		case ".":
			return true;
		default:
			return false;
	}
}

function wordValid(word) {

	switch (word) {
		case null:
		case undefined:
			return false;
		default:
			return true;
	}
}

exports.train = function(text) {

	let res = text.replace(/[^a-zA-Z0-9.!?,'\- ]/g, '').split(' ');

	/* detect sentence endings*/
	/* detect start of sentences */
	graph.start.push(res[0]);
	for (let i = 0; i < res.length; i++) {
		let value = res[i];
		if (endOfSentence(value)) {
			graph.end.push(value);
			if (wordValid(res[i+1]))
				graph.start.push(res[i+1]);
		}
	}

	/* add nodes */
	for (let i = 0; i < res.length; i++) {
		let value = res[i];
		if (wordValid(value))
			addNode(value);
	}

	/* add edges */
	for (let i = 1; i < res.length; i++) {
		let a = res[i-1];
		let b = res[i];
		if (wordValid(a) && wordValid(b))
			addEdge(a, b);
	}
}

function getDistribution(word) {

	let keys = Object.keys(graph.words[word]);

	let dist = [];
	keys.forEach(function(key){
		for (let i=0; i<graph.words[word][key]; i++)
			dist.push(key);
	});
	return dist;
}

function derive(str, word) {

	let dist = getDistribution(word);
	let next = dist[dist.length * Math.random() << 0];

	/* if word is in list of ending words finalize */
	str += ' ' + next;
	if (!graph.end.includes(next)) {
		return derive(str, next);
	} else {
		return str;
	}
}

exports.walk = function() {

	let keys = Object.keys(graph.start);
	let prop = graph.start[keys[keys.length * Math.random() << 0]];

	return derive(''+prop, prop);
}

exports.print = function() {

	console.log(graph);
}

exports.save = function(file) {

	let fs = require('fs');
	fs.writeFileSync('./train.json', JSON.stringify(graph));	
}

exports.load = function() {

	let fs = require('fs');
	graph = JSON.parse(fs.readFileSync('./train.json', 'utf8'));
}
