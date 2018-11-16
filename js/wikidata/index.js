var config = require('./config.json');
var rdf = require('../rdf-builder/rdf-builder.js');

var wikidata = require(config.source);

rdf.makeBase('http://movie.chatbot.org/');
const prefixes = {
	schema: "http://schema.org/",
	rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
	owl: "http://www.w3.org/2002/07/owl#",
	mcb: "http://movie.chatbot.org/",
	wdt: "http://www.wikidata.org/prop/direct/"
};
rdf.makePrefixes(prefixes);

wikidata.forEach(function(entry){

	rdf.makeConcept('#'+entry.imdbid);
	rdf.extendConcept('schema:identifier', '\"'+entry.imdbid+'\"');
	rdf.extendConcept('owl:sameAs', '\"'+entry.movie+'\"');
	if (entry.mcid != undefined)
		rdf.extendConcept('wdt:P1712','\"'+entry.mcid+'\"');
	rdf.finishConcept('rdf:type','schema:Movie');
});

rdf.print();
rdf.validate();
rdf.printToFile(config.store);
