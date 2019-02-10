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

/*
var mc = require('../../data/metacritic/movies.json');
mc.forEach(function(movie){

	try {
		var reviews = require('../../data/metacritic/emotions'+movie.substr(5)+'.json');

		reviews.forEach(function(review){

			review.text = String(review.text).replace(/[^a-zA-Z0-9.!?' ]/g, '');
			review.user = String(review.user).replace(/[^a-zA-Z0-9]/g, '_');

			rdf.makeConcept('#'+movie.substr(6)+'-'+review.user+'-bayes');
			rdf.extendConcept('rdf:type', 'onyx:EmotionSet');
			rdf.extendConcept('onyx:emotionText','\"'+review.text+'\"');
			rdf.extendConcept('onyx:describesObject','<#'+movie.substr(6)+'>');
			rdf.extendConcept('onyx:hasEmotion', '<#'+review.emotion+'>');
			rdf.finishConcept('prov:Entity', '<#'+movie.substr(6)+'-'+review.user+'>');

			rdf.makeConcept('#'+movie.substr(6)+'-'+review.user+'-bayes-analysis');
			rdf.extendConcept('onyx:algorithm','\"Naive Bayes\"');
			rdf.extendConcept('onyx:source','\"'+review.url+'\"');
			rdf.extendConcept('onyx:usesEmotionalModel','\"http://www.gsi.dit.upm.es/ontologies/wnaffect#WNAModel\"');
			rdf.finishConcept('prov:generated','<#'+movie.substr(6)+'-'+review.user+'-bayes>');
		});

	} catch (e) {
		console.log(e);
	}
});
*/

var imdb = require('../../data/imdb/movies.json');
for (let n=23; n<36; n++) {
console.log("n: " + n);
rdf.makePrefixes(prefixes);
//var n = 1;
for (let i=5000*(n-1); i<5000*n; i++) {
	let movie = imdb[i];
	try {
		let reviews = require('../../data/imdb/emotions2/'+movie+'.json');

		reviews.forEach(function(review){

			review.text = String(review.text).replace(/[^a-zA-Z0-9.!?' ]/g, '');
			review.user = String(review.user).replace(/[^a-zA-Z0-9]/g, '_');

			/* sentiment of a review - ex:Result1 of onyx spec */
			rdf.makeConcept('#'+movie+'-'+review.user+'-bayesv2');
			rdf.extendConcept('rdf:type', 'onyx:EmotionSet');
			rdf.extendConcept('onyx:emotionText','\"'+review.text+'\"');
			rdf.extendConcept('onyx:describesObject','<#'+movie+'>');
			rdf.extendConcept('onyx:hasEmotion', '<#'+review.emotion+'>');
			rdf.finishConcept('prov:Entity', '<#'+movie+'-'+review.user+'>');

			/* custom analysis */
			rdf.makeConcept('#'+movie+'-'+review.user+'-bayesv2-analysis');
			rdf.extendConcept('onyx:algorithm','\"Naive Bayes v2\"');
			rdf.extendConcept('onyx:source','\"'+review.url+'\"');
			rdf.extendConcept('onyx:usesEmotionalModel','\"http://www.gsi.dit.upm.es/ontologies/wnaffect#WNAModel\"');
			rdf.finishConcept('prov:generated','<#'+movie+'-'+review.user+'-bayesv2>');
		});

	} catch (e) {
		console.log(e);
	}
}

//rdf.print();
rdf.validate();
//rdf.printToFile('mc-emotions');
rdf.printToFile('imdb-emotions/emotions2/imdb-emotions'+n);
}
