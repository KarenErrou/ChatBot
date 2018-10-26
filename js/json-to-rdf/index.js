var ids = require("../../data/movies.json");

var movies = "../../data/movies/";
var reviews = "../../data/reviews/";

var rdf = require('./rdf-builder.js');

rdf.makeBase('http://movie.chatbot.org/');

const prefixes = {
	movie: "http://schema.org/Movie",
	review: "http://schema.org/Review",
	schema: "http://schema.org/",
	onyx: "http://www.gsi.dit.upm.es/ontologies/onyx/ns#",
	rdfs: "http://www.w3.org/2000/01/rdf-schema#",
	rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
};
rdf.makePrefixes(prefixes);

ids.forEach(function(id){
	var movie = require(movies+id+'.json');
	var review = require(reviews+id+'.json');

	console.log((review.secondary.length%5) == 0);
	if ((review.secondary.length%5) == 0) return;

	rdf.makeConcept('#'+id);
	rdf.extendConcept('rdf:type', 'schema:Movie');
	rdf.extendConcept('movie:identifier', '\"'+id+'\"');
	rdf.extendConcept('movie:name', '\"'+review.primary[0]+'\"');
	rdf.finishConcept('movie:image', '\"'+review.primary[1]+'\"');

	var range = review.secondary.length/5;
	var review_text = review.secondary.slice(0,range);
	var reviewer = review.secondary.slice(range+1, range*2);
	var date = review.secondary.slice((range*2)+1, range*3); 
	var rating = review.secondary.slice((range*3)+1, range*4); 
	var title = review.secondary.slice((range*4)+1, range*5); 

	for (var i=0; i<range; i++) {
		if (reviewer[i]==undefined) continue;

		reviewer[i] = String(reviewer[i]).replace(/[^a-zA-Z0-9]/g, '_');
		rdf.makeConcept('#'+id+'-'+reviewer[i]);
		rdf.extendConcept('review:about', '<#'+id+'>');

		rdf.extendConcept('review:author', '\"'+reviewer[i]+'\"');

		//rdf.extendConcept('review:reviewRating', rating[i]);

		review_text[i] = String(review_text[i]).replace(/[^a-zA-Z0-9.!?' ]/g, '');
		rdf.finishConcept('review:text', '\"'+review_text[i]+'\"');
	}
	//console.log(movie);
	//console.log(review);
});

rdf.print();
rdf.validate();
