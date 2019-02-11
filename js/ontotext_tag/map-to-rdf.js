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
	wnaffect: "http://www.gsi.dit.upm.es/ontologies/wnaffect/ns#",
    ontotext: "http://ontology.ontotext.com/"
};
rdf.makePrefixes(prefixes);

rdf.makeConcept('mcb:ReviewAnnotation');
rdf.finishConcept('rdf:type','owl:Class');

rdf.makeConcept('mcb:hasReviewAnnotation');
rdf.extendConcept('rdf:type','owl:ObjectProperty');
rdf.extendConcept('rdfs:range','mcb:ReviewAnnotation');
rdf.finishConcept('rdfs:domain','schema:Movie');

const data_dir = '../../data/imdb/';
const movies = require(data_dir+'movies.json');

const onto_dir = '../../ontology/nl-tags/';

movies.forEach(function(movie){
    try {
        const review_annotations = require(data_dir+'review-tags/'+movie+'.json');
        let i=0;
        review_annotations.forEach(function(annotation){
            //console.log(annotation.text +': '+annotation.type);

            rdf.makeConcept('#'+movie+'-annotation-'+i++);
            rdf.extendConcept('rdf:type','mcb:ReviewAnnotation');
            rdf.extendConcept('schema:text', '"'+annotation.text.replace(/[^a-zA-Z0-9.!?' ]/g, '')+'"');
            
            rdf.finishConcept('rdf:type','ontotext:'+annotation.type);

            rdf.makeConcept('#'+movie);
            rdf.finishConcept('mcb:hasReviewAnnotation','<#'+movie+'-annotation-'+i+'>');
        });
    } catch(err) {
        //console.log(err);
    }
});

rdf.print();
rdf.validate();
rdf.printToFile('nl-tags/nlp');
