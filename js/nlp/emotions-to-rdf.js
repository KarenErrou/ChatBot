var rdf = require('../rdf-builder/rdf-builder.js');

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

var mc = require('../../data/metacritic/movies.json');
mc.forEach(function(movie){

	try {
		var reviews = require('../../data/metacritic/emotions'+movie.substr(5)+'.json');

		reviews.forEach(function(review){

			review.text = String(review.text).replace(/[^a-zA-Z0-9.!?' ]/g, '');
			review.user = String(review.user).replace(/[^a-zA-Z0-9]/g, '_');

			/* sentiment of a review - ex:Result1 of onyx spec */
			rdf.makeConcept('#'+movie.substr(6)+'-'+review.user+'-sentiment');
			rdf.extendConcept('rdf:type', 'onyx:EmotionSet');
			rdf.extendConcept('onyx:emotionText','\"'+review.text+'\"');
			rdf.extendConcept('onyx:describesObject','<#'+movie.substr(6)+'>');
			rdf.extendConcept('onyx:hasEmotion', '<#'+review.emotion+'>');
			rdf.finishConcept('prov:Entity', '<#'+movie.substr(6)+'-'+review.user+'>');

			/* custom analysis */
			rdf.makeConcept('#'+movie.substr(6)+'-'+review.user+'-sentiment-analysis');
			rdf.extendConcept('onyx:algorithm','\"Naive Bayes\"');
			rdf.extendConcept('onyx:source','\"'+review.url+'\"');
			rdf.extendConcept('onyx:usesEmotionalModel','\"http://www.gsi.dit.upm.es/ontologies/wnaffect#WNAModel\"');
			rdf.finishConcept('prov:generated','<#'+movie.substr(6)+'-'+review.user+'-sentiment>');
		});

	} catch (e) {
		console.log(e);
	}
});
var imdb = require('../../data/imdb/movies.json');
imdb.forEach(function(movie){

	try {
		var reviews = require('../../data/imdb/emotions/'+movie+'.json');

		reviews.forEach(function(review){

			review.text = String(review.text).replace(/[^a-zA-Z0-9.!?' ]/g, '');
			review.user = String(review.user).replace(/[^a-zA-Z0-9]/g, '_');

			/* sentiment of a review - ex:Result1 of onyx spec */
			rdf.makeConcept('#'+movie+'-'+review.user+'-sentiment');
			rdf.extendConcept('rdf:type', 'onyx:EmotionSet');
			rdf.extendConcept('onyx:emotionText','\"'+review.text+'\"');
			rdf.extendConcept('onyx:describesObject','<#'+movie+'>');
			rdf.extendConcept('onyx:hasEmotion', '<#'+review.emotion+'>');
			rdf.finishConcept('prov:Entity', '<#'+movie+'-'+review.user+'>');

			/* custom analysis */
			rdf.makeConcept('#'+movie+'-'+review.user+'-sentiment-analysis');
			rdf.extendConcept('onyx:algorithm','\"Naive Bayes\"');
			rdf.extendConcept('onyx:source','\"'+review.url+'\"');
			rdf.extendConcept('onyx:usesEmotionalModel','\"http://www.gsi.dit.upm.es/ontologies/wnaffect#WNAModel\"');
			rdf.finishConcept('prov:generated','<#'+movie+'-'+review.user+'-sentiment>');
		});

	} catch (e) {
		console.log(e);
	}
});

//rdf.print();
rdf.validate();
rdf.printToFile('mc-emotions');
