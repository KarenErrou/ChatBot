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

var imdb = [];
var metacritic = [];

graphdb.query({query:qmovies}, function(results){

	console.log(results);

	results.results.bindings.forEach(function(e){

		var movie = {
			movie: e.film.value,
			imdbid: e.imdbid.value
		};

		if (e.mcid != undefined) {
			movie["mcid"] = e.mcid.value;
			metacritic.push(e.mcid.value);
		}

		imdb.push(e.imdbid.value);
		movies.push(movie);
	});

	var file = '../../../data/wikidata/wikidata_links.json';
	var moviesjson = JSON.stringify(movies);
	const fs = require('fs');
	fs.writeFile(file, moviesjson, 'utf8', (err)=>{
		if (err) throw err;
	});
	console.log(imdb);
	console.log(metacritic);

	/* atm this is not needed anymore */
	/* split imdb entries into chunks of size 25*/
	//var i, filenum=0, j, temp=[], chunk=25;
	//for (i=0,j=imdb.length; i<j; i+=chunk) {
	//	temparray = imdb.slice(i,i+chunk);

	//	var f = '../../imdb-data-miner/targets/wikidata/'+filenum+'.json';
	//	fs.writeFileSync(f, JSON.stringify(temparray));
	//	filenum++;
	//}

	//filenum=0;
	//for (i=0,j=imdb.length; i<j; i+=chunk) {
	//	temparray = metacritic.slice(i,i+chunk);

	//	var f = '../../metacritic-data-miner/targets/wikidata/'+filenum+'.json';
	//	fs.writeFileSync(f, JSON.stringify(temparray));
	//	filenum++;
	//}
});
