var graphdb = require('../graphdb/index.js');
var rdf = require('../rdf-builder/rdf-builder.js');

var q = "PREFIX wdt: <http://www.wikidata.org/prop/direct/> " +
	"PREFIX schema: <http://schema.org/> " +
	"PREFIX mcb: <http://movie.chatbot.org/> " +
	"select distinct ?imdbid ?mcid where {" +
	"	?m mcb:hasId ?imdbid ."+
	"	?m wdt:P1712 ?mcid ."+
	"}";


graphdb.query({query:q}, function(results){
	
	rdf.makeBase('http://movie.chatbot.org/');
	const prefixes = {
		owl: "http://www.w3.org/2002/07/owl#"
	};
	rdf.makePrefixes(prefixes);

	results.results.bindings.forEach(function(e){
		console.log(e);	
		rdf.makeConcept('#'+e.mcid.value.substr(6));
		rdf.finishConcept('owl:sameAs', '<#'+e.imdbid.value+'>');

		rdf.makeConcept('#'+e.imdbid.value);
		rdf.finishConcept('owl:sameAs', '<#'+e.mcid.value.substr(6)+'>');
	});
	rdf.print();
	rdf.printToFile('align/inter_graph_alignment');
	rdf.validate();
});
