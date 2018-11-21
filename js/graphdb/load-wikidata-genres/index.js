var graphdb = require('../index.js');

//film wdt:P345 ?imdbid
//film wdt:P1712 ?mcid
//film wdt:P1476 ?title
//film wdt:P136 ?genre
//film wdt:P57 ?director

var qmovies ="PREFIX wdt: <http://www.wikidata.org/prop/direct/> " +
	     "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
	     "select distinct ?film ?genre ?imdb where {"+
	     "  SERVICE <https://query.wikidata.org/sparql> {"+
	     "    ?film wdt:P31 <http://www.wikidata.org/entity/Q11424> ."+
	     "    ?film wdt:P345 ?imdb."+
	     "    ?film wdt:P136 / rdfs:label ?genre ."+
	     "    filter(langMatches(lang(?genre),\"EN\"))"+
	     "  }"+
	     "}";

var movies = [];

graphdb.query({query:qmovies}, function(results){

	results.results.bindings.forEach(function(e){

		var movie = {
			movie: e.film.value,
			genre: e.genre.value,
			imdb: e.imdb.value
		};

		movies.push(movie);
	});

	var file = '../../../data/wikidata/wikidata_genres.json';
	var moviesjson = JSON.stringify(movies);
	const fs = require('fs');
	fs.writeFile(file, moviesjson, 'utf8', (err)=>{
		if (err) throw err;
	});

	console.log(movies);
});
