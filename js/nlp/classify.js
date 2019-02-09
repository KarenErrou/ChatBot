const bayes = require('./text-classifier-js/index.js');
const fs = require('fs');

//var mc = require('../../data/metacritic/movies.json');

//mc.forEach(function(movie){
//	
//	try {
//		var relations = [];
//		var reviews = require('../../data/metacritic/reviews'+movie.substr(5)+'.json');
//		for (var i=0; i<reviews["review-text"].length; i++) {
//			
//			relations.push({
//				emotion: bayes.classify(reviews["review-text"][i]),
//				movie: movie.substr(5),
//				url: reviews["review-url"][0],
//				text: reviews["review-text"][i],
//				user: reviews["review-user"][i]
//			});
//		}
//		fs.writeFileSync('../../data/metacritic/emotions'+movie.substr(5)+'.json', JSON.stringify(relations));
//
//	} catch (e) {
//		console.log(e);
//	}
//});

let imdb = require('../../data/imdb/movies.json');

for (let i=0; i<imdb.length; i++) {
	
	try {
		let movie = imdb[i];
		let relations = [];
		let reviews = require('../../data/imdb/reviews/'+movie+'.json');
		for (var j=0; j<reviews["review-text"].length; j++) {
			let emotion = bayes.classify(reviews["review-text"][j]);
			relations.push({
				emotion: emotion,
				movie: movie,
				url: reviews["review-url"][0],
				text: reviews["review-text"][j],
				user: reviews["review-user"][j]
			});
            console.log(movie + ': ' + emotion);
            console.log(reviews["review-text"][j]);
		}
		fs.writeFileSync('../../data/imdb/emotions2/'+movie+'.json', JSON.stringify(relations));

	} catch (e) {
		console.log(e);
	}
}
