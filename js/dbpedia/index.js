var config = require('./config.json');
var rdf = require('../rdf-builder/rdf-builder.js');

var dbpedia = require(config.source);

rdf.makeBase('http://movie.chatbot.org/');
const prefixes = {
	owl: "http://www.w3.org/2002/07/owl#",
	mcb: "http://movie.chatbot.org/",
};
rdf.makePrefixes(prefixes);

dbpedia.forEach(function(entry){

	rdf.makeConcept('#'+entry.movie);
	rdf.finishConcept('owl:sameAs', '<'+entry.dbpedia+'>');

});

rdf.print();
rdf.validate();
rdf.printToFile('dbpedia/'+config.store);
