var graphdb = require('../index.js');

var qdblinks =	"PREFIX schema: <http://schema.org/>"+
		"PREFIX owl: <http://www.w3.org/2002/07/owl#>"+
		"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
		"PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>"+
		"PREFIX mcb: <http://movie.chatbot.org/>"+
		"SELECT ?film ?wdlink ?dblink ?imdb WHERE {"+
		"	SERVICE <http://dbpedia.org/sparql> {"+
		"		?dblink a dbpedia-owl:Film ."+
		"		?dblink owl:sameAs ?wdlink"+
		"	}"+
		"	?film a schema:Movie ."+
		"	?film mcb:hasId ?imdb ."+
	     	"	?film owl:sameAs ?wdlink ."+
		"}";

var movies = [];

graphdb.query({query:qdblinks}, function(results){

	console.log(results);

	results.results.bindings.forEach(function(e){

		var movie = {
			movie: e.imdb.value,
			dbpedia: e.dblink.value
		};

		movies.push(movie);
	});

	var file = '../../../data/dbpedia/dbpedia_links.json';
	const fs = require('fs');
	fs.writeFileSync(file, JSON.stringify(movies));
});
