var graphdb = require('../index.js');

//film wdt:P345 ?imdbid
//film wdt:P1712 ?mcid
//film wdt:P1476 ?title
//film wdt:P136 ?genre
//film wdt:P57 ?director

var qmovies ="PREFIX wdt: <http://www.wikidata.org/prop/direct/> " +
	     "select distinct ?film ?imdbid ?mcid where {"+
	     "  SERVICE <https://query.wikidata.org/sparql> {"+
	     "    ?film wdt:P31 <http://www.wikidata.org/entity/Q11424> ."+
	     "    ?film wdt:P345 ?imdbid ."+
	     "    OPTIONAL {"+
	     "      ?film wdt:P1712 ?mcid ."+
	     "    }"+
	     "  }"+
	     "}";

var movies = [];

graphdb.query({query:qmovies}, function(results){

	console.log(results);

	results.results.bindings.forEach(function(e){

		var movie = {
			movie: e.film.value,
			imdbid: e.imdbid.value
		};
		if (e.mcid != undefined)
			movie["mcid"] = e.mcid.value;

		movies.push(movie);
	});

	var file = 'temp.json';
	var moviesjson = JSON.stringify(movies);
	const fs = require('fs');
	fs.writeFile(file, moviesjson, 'utf8', (err)=>{
		if (err) throw err;
	});
});
