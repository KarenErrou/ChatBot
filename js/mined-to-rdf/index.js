/* this for now still is imdb specific
 * this will probably be generalized with some foreach's
 * -> for every data source create single ttl file
 * -> insert into graph db as named graph
 * -> will make config.json file for this
 * -> source json files MUST have same property names
 * -> this file will have to become much more robust
 * */
var config = require('./config.json');
const wnaffect = require("./emotions.json"); 

config.sources.forEach(function(entry){

	var ids = require(config.data_dir + entry.source + '/movies.json');
	var movies = config.data_dir + entry.source + '/movies/';
	var reviews = config.data_dir + entry.source + '/reviews/';
	
	// from 0 to 19
	var n = 2;
	//var n = 35;
	var i, filenum=n*50, j, temp=[], chunk=100;
	for (i=filenum*chunk,j=(filenum*chunk)+5000; i<j; i+=chunk) {
	//for (i=filenum*chunk,j=ids.length; i<j; i+=chunk) {

		var rdf = require('../rdf-builder/rdf-builder.js');
		rdf.makeBase('http://movie.chatbot.org/');

		const prefixes = {
			mcb: "http://movie.chatbot.org/",
			schema: "http://schema.org/",
			onyx: "http://www.gsi.dit.upm.es/ontologies/onyx/ns#",
			rdfs: "http://www.w3.org/2000/01/rdf-schema#",
			rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
			prov: "http://www.w3.org/ns/prov#",
			xsd: "http://www.w3.org/2001/XMLSchema",
			owl: "http://www.w3.org/2002/07/owl",
			wnaffect: "http://www.gsi.dit.upm.es/ontologies/wnaffect/ns#"
		};
		rdf.makePrefixes(prefixes);

		/* object properties */

		// The domain of schema:actor is a movie
		rdf.makeConcept('mcb:hasActor');
		rdf.extendConcept('rdf:type','owl:ObjectProperty');
		rdf.extendConcept('rdfs:range','schema:Person');
		rdf.finishConcept('rdfs:domain','schema:Movie');

		/* data properties */

		// A movie has to have one unique id (via functional property)
		rdf.makeConcept('mcb:hasId');
		rdf.extendConcept('rdf:type','owl:DatatypeProperty, owl:FunctionalProperty');
		rdf.extendConcept('rdfs:range','xsd:string');
		rdf.finishConcept('rdfs:domain','schema:Movie');

		// A movie has either one or zero Metacritic ids

		// Two movies can have the same title (not a functional property)
		rdf.makeConcept('mcb:hasTitle');
		rdf.extendConcept('rdf:type','owl:DatatypeProperty');
		rdf.extendConcept('rdfs:range','xsd:string');
		rdf.finishConcept('rdfs:domain','schema:Movie');
	
		rdf.makeConcept('mcb:hasGenre');
		rdf.extendConcept('rdf:type','owl:DatatypeProperty');
		rdf.extendConcept('rdfs:range','xsd:string');
		rdf.finishConcept('rdfs:domain','schema:Movie');

		rdf.makeConcept('mcb:hasLanguage');
		rdf.extendConcept('rdf:type','owl:DatatypeProperty');
		rdf.extendConcept('rdfs:range','xsd:string');
		rdf.finishConcept('rdfs:domain','schema:Movie');

		/* classes */

		rdf.makeConcept('schema:Person');
		rdf.finishConcept('rdf:type','owl:Class');

		rdf.makeConcept('schema:Movie');
		rdf.finishConcept('rdf:type','owl:Class');

		// An actor is a person
		rdf.makeConcept('mcb:actorIsPerson');
		rdf.extendConcept('rdf:type','owl:Restriction');
		rdf.extendConcept('owl:onProperty','mcb:hasActor');
		rdf.finishConcept('owl:allValuesFrom','schema:Person');

		// A movie can have multiple genres but at least 1
		rdf.makeConcept('mcb:atLeastOneGenre');
		rdf.extendConcept('rdf:type','owl:Restriction');
		rdf.extendConcept('owl:onProperty','mcb:hasGenre');
		rdf.finishConcept('owl:minCardinality','"1"^^xsd:nonNegativeInteger');

		// A movie can have multiple languages or none
		rdf.makeConcept('mcb:anyNumberOfLanguages');
		rdf.extendConcept('rdf:type','owl:Restriction');
		rdf.extendConcept('owl:onProperty','mcb:hasLanguage');
		rdf.finishConcept('owl:minCardinality','"0"^^xsd:nonNegativeInteger');

		// Pulp Fiction is different from Star Wars

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

		/* temparray to avoid oversized heap */
		temparray = ids.slice(i,i+chunk);
		temparray.forEach(function(id){
			id = id.substr(6);
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
			if (movie["movie-rating-count"][0] != null && movie["movie-rating-count"][0] != undefined)
				rdf.extendConcept('schema:ratingCount',movie["movie-rating-count"][0]);
			if (movie["movie-rating-value"][0] != null && movie["movie-rating-value"][0] != undefined && movie["movie-rating-value"][0] != "tbd")
				rdf.extendConcept('schema:ratingValue',movie["movie-rating-value"][0]);
			if (movie["movie-best-rating"][0] != null && movie["movie-best-rating"][0] != undefined)
				rdf.extendConcept('schema:bestRating',movie["movie-best-rating"][0]);
			rdf.finishConcept('schema:itemReviewed','<#'+id+'>');

			rdf.makeConcept('#'+id);
			rdf.extendConcept('rdf:type','schema:Movie');
			rdf.extendConcept('mcb:hasId','\"'+id+'\"');
			movie["movie-title"][0] = String(movie["movie-title"][0]).replace(/[^a-zA-Z0-9.!?'() ]/g, '');
			rdf.extendConcept('mcb:hasTitle','\"'+movie["movie-title"][0]+'\"');

			movie["movie-duration"][0] = String(movie["movie-duration"][0]).replace(/[^a-zA-Z0-9.!?']/g, '');
			rdf.extendConcept('schema:duration','\"'+movie["movie-duration"][0]+'\"');

			if (movie["movie-year"][0] != null && movie["movie-year"][0] != undefined)
				rdf.extendConcept('schema:dateCreated','\"'+movie["movie-year"][0]+'\"');

			if (movie["movie-description"][0] != null && movie["movie-description"][0] != undefined) {
				movie["movie-description"][0] = String(movie["movie-description"][0]).replace(/[^a-zA-Z0-9.!?' ]/g, '');
				rdf.extendConcept('schema:text','\"'+movie["movie-description"][0]+'\"');
			}
			rdf.extendConcept('schema:aggregateRating','<#'+id+'-aggregateRating>');

			var actors = movie["movie-actor"];
			for (var i=0; i<actors.length; i++) {
				actors[i] = String(actors[i]).replace(/[^a-zA-Z0-9.!?']/g, '');
				rdf.extendConcept('mcb:hasActor','<#'+actors[i]+'>');
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
				rdf.extendConcept('schema:dateCreated', '\"'+new Date(date[i])+'\"');

				/* robustness is necessary due to flaws in the data */
				if (rating[i] != undefined && rating[i] != null)
					rdf.extendConcept('schema:reviewRating', rating[i]);

				if (title[i] != undefined && title[i] != null) {
					title[i] = String(title[i]).replace(/[^a-zA-Z0-9.!?' ]/g, '');
					rdf.extendConcept('schema:headline', '\"'+title[i]+'\"');
				}

				review_text[i] = String(review_text[i]).replace(/[^a-zA-Z0-9.!?' ]/g, '');
				rdf.finishConcept('schema:reviewBody','\"'+review_text[i]+'\"');

				/* sentiment of a review - ex:Result1 of onyx spec */
				rdf.makeConcept('#'+id+'-'+reviewer[i]+'-random');
				rdf.extendConcept('rdf:type', 'onyx:EmotionSet');
				rdf.extendConcept('onyx:emotionText','\"'+review_text[i]+'\"');
				rdf.extendConcept('onyx:describesObject','<#'+id+'>');
				rdf.extendConcept('onyx:hasEmotion', '<#'+getRandomEmotion()+'>');
				rdf.finishConcept('prov:Entity', '<#'+id+'-'+reviewer[i]+'>');

				/* custom analysis */
				rdf.makeConcept('#'+id+'-'+reviewer[i]+'-random-analysis');
				rdf.extendConcept('onyx:algorithm','\"RNG\"');
				rdf.extendConcept('onyx:source','\"'+review["review-url"][0]+'\"');
				rdf.extendConcept('onyx:usesEmotionalModel','\"http://www.gsi.dit.upm.es/ontologies/wnaffect#WNAModel\"');
				rdf.finishConcept('prov:generated','<#'+id+'-'+reviewer[i]+'-random>');

			}
			//console.log(movie);
			//console.log(review);
		});
		//rdf.print();
		rdf.validate();
		rdf.printToFile('metacritic/'+entry.graph+filenum);
		filenum++;
		rdf = {};
	}
});
