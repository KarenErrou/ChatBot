var bayes = require('./bayes.js');

/* graphdb approach does not work since data is too big */
//var graphdb = require('../graphdb/index.js');
//var q = "PREFIX schema: <http://schema.org/>"+
//	"SELECT ?r ?text"+
//	"WHERE {"+
//	"    ?r schema:reviewBody ?text ."+
//	"}"; 
//
//graphdb.query({query:q}, function(results){
//
//	console.log(results);
//
//	results.results.bindings.forEach(function(e){
//		var emotion = bayes.classify(e.text.value);
//		console.log(emotion);
//	});
//});

const fs = require('fs');

var mc = require('../../data/metacritic/movies.json');

mc.forEach(function(movie){
	
	try {
		var relations = [];
		var reviews = require('../../data/metacritic/reviews'+movie.substr(5)+'.json');
		for (var i=0; i<reviews["review-text"].length; i++) {
			
			relations.push({
				emotion: bayes.classify(reviews["review-text"][i]),
				movie: movie.substr(5),
				url: reviews["review-url"][0],
				text: reviews["review-text"][i],
				user: reviews["review-user"][i]
			});
		}
		fs.writeFileSync('../../data/metacritic/emotions'+movie.substr(5)+'.json', JSON.stringify(relations));

	} catch (e) {
		console.log(e);
	}
});

var imdb = require('../../data/imdb/movies.json');

imdb.forEach(function(movie){
	
	try {
		var relations = [];
		var reviews = require('../../data/imdb/reviews/'+movie+'.json');
		for (var i=0; i<reviews["review-text"].length; i++) {
			
			relations.push({
				emotion: bayes.classify(reviews["review-text"][i]),
				movie: movie,
				url: reviews["review-url"][0],
				text: reviews["review-text"][i],
				user: reviews["review-user"][i]
			});
		}
		fs.writeFileSync('../../data/imdb/emotions/'+movie+'.json', JSON.stringify(relations));

	} catch (e) {
		console.log(e);
	}
});
