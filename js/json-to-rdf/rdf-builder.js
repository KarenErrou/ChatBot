var os = require('os');
var chalk = require('chalk');

var rdf = '';

function log(string){
	if (false)
		console.log(string);
}

exports.makeBase = function(base) {
	rdf += '@base <'+base+'>.' + os.EOL;
}

exports.makePrefixes = function(prefixes) {
	log(chalk.blue("Making prefixes..."));
	for (var k in prefixes) {
		rdf += '@prefix '+k+': <'+prefixes[k]+'>.'+os.EOL;
	}
}

exports.makeConcept = function(subject) {
	log(chalk.blue("Making concept: "+subject));
	rdf += os.EOL+'<'+subject+'>'+os.EOL;
}

exports.extendConcept = function(predicate, object) {
	if (Array.isArray(object)) {
		log(chalk.blue("Extending concept by "+predicate+' '+object));
		rdf += '\t'+predicate+' (';
		object.forEach(function(item) {
			rdf += ' "'+object+'"'
		});
		rdf += ' );';
	} else {
		log(chalk.blue("Extending concept by "+predicate+' '+object));
		rdf += '\t'+predicate+' '+object+';'+os.EOL;
	}
}

exports.finishConcept = function(predicate, object) {
	if (Array.isArray(object)) {
		log(chalk.blue("Extending concept by "+predicate+' '+object));
		rdf += '\t'+predicate+' (';
		object.forEach(function(item) {
			rdf += ' "'+object+'"'
		});
		rdf += ' ).';
	} else {
		log(chalk.blue("Extending concept by "+predicate+' '+object));
		rdf += '\t'+predicate+' '+object+'.'+os.EOL;
	}
}

exports.makeTriple = function(subject, predicate, object) {
	log(chalk.blue("Making triple ("+subject+","+
				predicate+","+
				object+")"));
	rdf += subject+' '+predicate+' '+object+';'+os.EOL;
}

exports.print = function() {
	console.log(chalk.blue(rdf));
}

exports.printToFile = function() {
	const fs = require('fs');
	fs.writeFile('./graph.ttl', rdf, 'utf8', (err)=>{
		if (err) throw err;
	});
}

exports.validate = function() {
	const N3 = require('n3');
	const parser = new N3.Parser();
	parser.parse(rdf, (error, quad, prefixes) => {
		if (error) {
			console.log(chalk.red(error));
		}
	});
}
