var ids = require("../../data/movies.json");

var movies = "../../data/movies/";
var reviews = "../../data/reviews/";

var rdf = require('./rdf-builder.js');

rdf.makeBase('http://movie.chatbot.org/');

const prefixes = {
	movie: "http://schema.org/Movie",
	person: "http://schema.org/Person",
	review: "http://schema.org/Review",
	ar: "http://schema.org/AggregateRating",
	schema: "http://schema.org/",
	onyx: "http://www.gsi.dit.upm.es/ontologies/onyx/ns#",
	rdfs: "http://www.w3.org/2000/01/rdf-schema#",
	rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
	prov: "http://www.w3.org/ns/prov#",
	wnaffect: "http://www.gsi.dit.upm.es/ontologies/wnaffect/ns#"
};
rdf.makePrefixes(prefixes);

const wnaffect = require("./emotions.json"); 
wnaffect.emotions.forEach(function(emotion){
	rdf.makeConcept('#'+emotion);
	rdf.finishConcept('onyx:hasEmotionCategory', wnaffect.prefix+':'+emotion);
});

var emotion_counter = 0;
getRandomEmotion = function(){
	if (emotion_counter > wnaffect.emotions.length-1) emotion_counter = 0;
	return wnaffect.emotions[emotion_counter++];
}

ids.forEach(function(id){
	var movie = require(movies+id+'.json');
	var review = require(reviews+id+'.json');

	console.log((review.secondary.length%5) == 0);
	if ((review.secondary.length%5) == 0) return;

	var actor_range = movie.secondary.length/2;
	var characters = movie.secondary.slice(0, actor_range);
	var actors = movie.secondary.slice(actor_range+1, actor_range*2);
	for (var i=0; i<actors.length; i++) {
		rdf.makeConcept('#'+String(actors[i]).replace(/[^a-zA-Z0-9.!?']/g, ''));
		actors[i] = String(actors[i]).replace(/[^a-zA-Z0-9.!?' ]/g, '');
		rdf.extendConcept('rdf:type','schema:Person');
		rdf.finishConcept('person:name','\"'+actors[i]+'\"');
	}

	rdf.makeConcept('#'+id+'-aggregateRating');
	rdf.extendConcept('ar:ratingCount',movie.primary[1]);
	rdf.extendConcept('ar:ratingValue',movie.primary[2]);
	rdf.extendConcept('ar:bestRating',movie.primary[3]);
	rdf.finishConcept('ar:itemReviewed','<#'+id+'>');

	rdf.makeConcept('#'+id);
	rdf.extendConcept('rdf:type','schema:Movie');
	rdf.extendConcept('movie:identifier','\"'+id+'\"');
	rdf.extendConcept('movie:name','\"'+review.primary[0]+'\"');

	movie.primary[0] = String(movie.primary[0]).replace(/[^a-zA-Z0-9.!?']/g, '');
	rdf.extendConcept('movie:duration','\"'+movie.primary[0]+'\"');
	rdf.extendConcept('movie:dateCreated',movie.primary[4]);

	movie.primary[5] = String(movie.primary[5]).replace(/[^a-zA-Z0-9.!?' ]/g, '');
	rdf.extendConcept('movie:text','\"'+movie.primary[5]+'\"');
	rdf.extendConcept('movie:aggregateRating','<#'+id+'-aggregateRating>');

	var actor_range = movie.secondary.length/2;
	var actors = movie.secondary.slice(actor_range+1, actor_range*2);
	for (var i=0; i<actors.length; i++) {
		actors[i] = String(actors[i]).replace(/[^a-zA-Z0-9.!?' ]/g, '');
		rdf.extendConcept('schema:actor','\"'+actors[i]+'\"');
	}
	var characters = movie.secondary.slice(0, actor_range);
	for (var i=0; i<characters.length; i++) {
		characters[i] = String(characters[i]).replace(/[^a-zA-Z0-9.!?']/g, '');
		rdf.extendConcept('schema:character','\"'+characters[i]+'\"');
	}
	rdf.finishConcept('movie:image', '\"'+review.primary[1]+'\"');

	/* extract review stuff */
	var range = review.secondary.length/5;
	var review_text = review.secondary.slice(0,range);
	var reviewer = review.secondary.slice(range+1, range*2);
	var date = review.secondary.slice((range*2)+1, range*3); 
	var rating = review.secondary.slice((range*3)+1, range*4); 
	var title = review.secondary.slice((range*4)+1, range*5); 

	for (var i=0; i<range; i++) {
		if (reviewer[i]==undefined) continue;

		/* a single review */
		reviewer[i] = String(reviewer[i]).replace(/[^a-zA-Z0-9]/g, '_');
		rdf.makeConcept('#'+id+'-'+reviewer[i]);
		rdf.extendConcept('review:about', '<#'+id+'>');

		rdf.extendConcept('review:author', '\"'+reviewer[i]+'\"');

		/* robustness is necessary due to flaws in the data */
		if (date[i] instanceof Date && !isNaN(date[i]))
			rdf.extendConcept('review:dateCreated', '\"'+new Date(date[i])+'\"');
		else
			rdf.extendConcept('review:dateCreated', '\"'+new Date()+'\"');

		/* robustness is necessary due to flaws in the data */
		if (isNaN(rating[i]))
			rdf.extendConcept('review:reviewRating', -1);
		else
			rdf.extendConcept('review:reviewRating', rating[i]);

		title[i] = String(title[i]).replace(/[^a-zA-Z0-9.!?' ]/g, '');
		rdf.extendConcept('review:headline', '\"'+title[i]+'\"');

		review_text[i] = String(review_text[i]).replace(/[^a-zA-Z0-9.!?' ]/g, '');
		rdf.finishConcept('review:reviewBody','\"'+review_text[i]+'\"');

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
		rdf.extendConcept('onyx:source','\"'+review.primary[2]+'\"');
		rdf.extendConcept('onyx:usesEmotionalModel','\"http://www.gsi.dit.upm.es/ontologies/wnaffect#WNAModel\"');
		rdf.finishConcept('prov:generated','<#'+id+'-'+reviewer[i]+'-sentiment>');

	}
	//console.log(movie);
	//console.log(review);
});

rdf.print();
rdf.validate();
rdf.printToFile();
