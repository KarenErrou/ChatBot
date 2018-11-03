/* this for now still is imdb specific
 * this will probably be generalized with some foreach's
 * -> for every data source create single ttl file
 * -> insert into graph db as named graph
 * -> will make config.json file for this
 * -> source json files MUST have same property names
 * -> this file will have to become much more robust
 * */
var config = require('./config.json');

config.sources.forEach(function(entry){
	var rdf = require('./rdf-builder.js');
	var ids = require(config.data_dir + entry.source + '/movies.json');
	var movies = config.data_dir + entry.source + '/movies/';
	var reviews = config.data_dir + entry.source + '/reviews/';

	rdf.makeBase('http://movie.chatbot.org/');

	const prefixes = {
		schema: "http://schema.org/",
		onyx: "http://www.gsi.dit.upm.es/ontologies/onyx/ns#",
		rdfs: "http://www.w3.org/2000/01/rdf-schema#",
		rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
		prov: "http://www.w3.org/ns/prov#",
		wnaffect: "http://www.gsi.dit.upm.es/ontologies/wnaffect/ns#"
	};
	rdf.makePrefixes(prefixes);

	/* apply random emotions until we figure out how to do it properly */
	const wnaffect = require("./emotions.json"); 
	wnaffect.emotions.forEach(function(emotion){
		rdf.makeConcept('#'+emotion);
		rdf.finishConcept('onyx:hasEmotionCategory', wnaffect.prefix+':'+emotion);
	});

	var emotion_counter = 0;
	getRandomEmotion = function(){
		if (emotion_counter > wnaffect.emotions.length-1)
			emotion_counter = 0;
		return wnaffect.emotions[emotion_counter++];
	}

	ids.forEach(function(id){
		var movie;
		var review;
		/* when the miner has 404 errors stuff might be corrupted so this is for robustness */
		try {
			movie = require(movies+id+'.json');
			review = require(reviews+id+'.json');
		} catch(e) {
			console.log(e);
			return;
		}

		var actors = movie["movie-actor"];
		for (var i=0; i<actors.length; i++) {
			rdf.makeConcept('#'+String(actors[i]).replace(/[^a-zA-Z0-9.!?']/g, ''));
			actors[i] = String(actors[i]).replace(/[^a-zA-Z0-9.!?' ]/g, '');
			rdf.extendConcept('rdf:type','schema:Person');
			rdf.finishConcept('schema:name','\"'+actors[i]+'\"');
		}

		rdf.makeConcept('#'+id+'-aggregateRating');
		rdf.extendConcept('schema:ratingCount',movie["movie-rating-count"][0]);
		rdf.extendConcept('schema:ratingValue',movie["movie-rating-value"][0]);
		rdf.extendConcept('schema:bestRating',movie["movie-best-rating"][0]);
		rdf.finishConcept('schema:itemReviewed','<#'+id+'>');

		rdf.makeConcept('#'+id);
		rdf.extendConcept('rdf:type','schema:Movie');
		rdf.extendConcept('schema:identifier','\"'+id+'\"');
		movie["movie-title"][0] = String(movie["movie-title"][0]).replace(/[^a-zA-Z0-9.!?'() ]/g, '');
		rdf.extendConcept('schema:name','\"'+movie["movie-title"][0]+'\"');

		movie["movie-duration"][0] = String(movie["movie-duration"][0]).replace(/[^a-zA-Z0-9.!?']/g, '');
		rdf.extendConcept('schema:duration','\"'+movie["movie-duration"][0]+'\"');

		//if (movie["movie-year"][0] instanceof Date && !isNaN(movie["movie-year"][0]))
		rdf.extendConcept('schema:dateCreated','\"'+movie["movie-year"][0]+'\"');
		//else
		//	rdf.extendConcept('schema:dateCreated','\"'+new Date().now+'\"');

		movie["movie-description"][0] = String(movie["movie-description"][0]).replace(/[^a-zA-Z0-9.!?' ]/g, '');
		rdf.extendConcept('schema:text','\"'+movie["movie-description"][0]+'\"');
		rdf.extendConcept('schema:aggregateRating','<#'+id+'-aggregateRating>');

		var actors = movie["movie-actor"];
		for (var i=0; i<actors.length; i++) {
			actors[i] = String(actors[i]).replace(/[^a-zA-Z0-9.!?' ]/g, '');
			rdf.extendConcept('schema:actor','\"'+actors[i]+'\"');
		}

		var characters = movie["movie-character"];
		for (var i=0; i<characters.length; i++) {
			characters[i] = String(characters[i]).replace(/[^a-zA-Z0-9.!?']/g, '');
			rdf.extendConcept('schema:character','\"'+characters[i]+'\"');
		}
		rdf.finishConcept('schema:image', '\"'+movie["movie-image"][0]+'\"');

		/* extract review stuff */
		var review_text = review["review-text"];
		var reviewer = review["review-user"];
		var date = review["review-date"]; 
		var rating = review["review-rating"]; 
		var title = review["review-title"]; 

		for (var i=0; i<review_text.length; i++) {

			/* a single review */
			reviewer[i] = String(reviewer[i]).replace(/[^a-zA-Z0-9]/g, '_');
			rdf.makeConcept('#'+id+'-'+reviewer[i]);
			rdf.extendConcept('schema:about', '<#'+id+'>');
			rdf.extendConcept('schema:author', '\"'+reviewer[i]+'\"');

			/* robustness is necessary due to flaws in the data */
			//if (date[i] instanceof Date && !isNaN(date[i]))
			rdf.extendConcept('schema:dateCreated', '\"'+new Date(date[i])+'\"');
			//else
			//	rdf.extendConcept('schema:dateCreated', '\"'+new Date().now+'\"');

			/* robustness is necessary due to flaws in the data */
			if (isNaN(rating[i]))
				rdf.extendConcept('schema:reviewRating', -1);
			else
				rdf.extendConcept('schema:reviewRating', rating[i]);

			title[i] = String(title[i]).replace(/[^a-zA-Z0-9.!?' ]/g, '');
			rdf.extendConcept('schema:headline', '\"'+title[i]+'\"');

			review_text[i] = String(review_text[i]).replace(/[^a-zA-Z0-9.!?' ]/g, '');
			rdf.finishConcept('schema:reviewBody','\"'+review_text[i]+'\"');

			/* sentiment of a review - ex:Result1 of onyx spec */
			rdf.makeConcept('#'+id+'-'+reviewer[i]+'-sentiment');
			rdf.extendConcept('rdf:type', 'onyx:EmotionSet');
			rdf.extendConcept('onyx:emotionText','\"'+review_text[i]+'\"');
			rdf.extendConcept('onyx:describesObject','<#'+id+'-'+reviewer[i]+'-sentiment>');
			rdf.extendConcept('onyx:hasEmotion', '<#'+getRandomEmotion()+'>');
			rdf.finishConcept('prov:Entity', '<#'+id+'-'+reviewer[i]+'>');

			/* custom analysis */
			rdf.makeConcept('#'+id+'-'+reviewer[i]+'-sentiment-analysis');
			rdf.extendConcept('onyx:algorithm','\"RNG\"');
			rdf.extendConcept('onyx:source','\"'+review["review-url"][0]+'\"');
			rdf.extendConcept('onyx:usesEmotionalModel','\"http://www.gsi.dit.upm.es/ontologies/wnaffect#WNAModel\"');
			rdf.finishConcept('prov:generated','<#'+id+'-'+reviewer[i]+'-sentiment>');

		}
		//console.log(movie);
		//console.log(review);
	});

	rdf.print();
	rdf.validate();
	rdf.printToFile(entry.graph);

});
