---
author:
	name1: Arno Breitfuss 
	name2: Karen Errou 
	name3: Juliette Opdenplatz
title:
	main: Semantic Web
	sub1: Proseminar Group 3
	sub2: Emotional Reasoning Chat Bot
revision:
	level: 1
	date: 99.99.9999
---

# Emotional Reasoning Chat Bot

The goal of the proseminar is to create a chatbot that is able to perform emotional reasoning.

> Emotional reasoning is a cognitive process by which a person concludes that his/her emotional reaction proves something is true, regardless of the observed evidence.
>
> -- <cite>Wikipedia</cite>

Reasoning processes of humans are mainly different than reasoning principles of machines, as humans made decisions basing not only on logics and facts, but basing on emotions, biases and comparatively very limited information. 

This project will collect and design ontologies and data representing human emotions and design reasoning mechanisms employing these. The reasoning mechanisms can be inbuilt in practical scenarios e.g. in online marketing - designing of a chatbot that appeals to emotions of humans and trying to change their behaviour. Or a character that goes beyond the "personal assistant" mode.

## Dataset Search

- [Linked Open Vocabularies.](https://lov.linkeddata.es/dataset/lov)
- [Google dataset search.](https://toolbox.google.com/datasetsearch)
- [CKAN (datasets search).](https://ckan.org)

### Movies and their Non-numerical reviews for Deducing Emotions

- [A small set of 16 movies](https://www.kaggle.com/jonsteve/user-reviews-of-16-movies-on-rotten-tomatoes)
- [A large set of movies usually used for binary sentiment classification (positive|negative)](http://www.cs.cornell.edu/people/pabo/movie-review-data/)
- [Another set of 25,000 movies also for binary sentiment classsification](http://ai.stanford.edu/~amaas/data/sentiment/)

## Means to Model Emotions 

### Emotion Markup Language (EmotionML)

[EmotionML](https://www.w3.org/TR/emotionml/)

### Human Emotions Onotology (HEO)

[Human Emotions Ontology (HEO)](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.460.2603&rep=rep1&type=pdf)

### Onyx - An Emotion Modelling Ontology

- [Specification](http://www.gsi.dit.upm.es/ontologies/onyx/)
- [Onyx: A Linked Data Approach to Emotion Representation](http://oa.upm.es/37389/1/INVE_MEM_2015_190501.pdf)

### Human Stress Ontology (HSO)

[Human Stress Ontology (HSO)](https://onlinelibrary.wiley.com/doi/epdf/10.1080/00050061003664811)

### Linked Data Models for Emotion and Sentiment Analysis W3C Community Group

[Linked Data Models for Emotion and Sentiment Analysis W3C Community Group](https://www.w3.org/community/sentiment/) (apparently not very active)

### WordNet-Affect Taxonomy

[WordNet-Affect Taxonomy](http://www.gsi.dit.upm.es/ontologies/wnaffect/)

## Movie Related Knowledge Graphs

### Schema.org Movie

[Specification](https://schema.org/Movie)

## Our Knowledge Graph

[A first glance of our graph model.](https://drive.google.com/file/d/1T9ww8kX9F9dy6ytcPoA-I7eyKJZaKS-5/view)

```
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns# >.
@prefix schema: <http://schema.org/Movie>.
@prefix onyx: <http://gsi.dit.upm.es/ontologies/onyx/ns>.
@prefix wna: <http://gsi.dit.upm.es/ontologies/wnaffect/ns>.

mcb:User a rdfs:Class;
	rdfs:comment "A user that is chatting with the bot";
	rdfs:label "User";
	onyx:hasEmotion [
		onyx:hasEmotionCategory wna:anger;
		onyx:hasEmotionIntensity :1.0;
	];
	mcb:hasMovieHistory [
		schema:Movie mcb:pulp_fiction;
		schema:Movie mcb:deadpool;
	];

mcb:Movie a rdfs:Class;
	rdfs:comment "A Movie";
	rdfs:label "Movie";
	mcb:hasRelatedEmotions [
		onyx:Emotion onyx:Sad;
		onyx:Emotion onyx:Thrilled;
	];

mcb:hasRelatedEmotions a rdf:Property;
	rdfs:comment "Movies emotions related to them";
	rdfs:label "hasRelatedEmotions";
	rdfs:type rdf:Bag;
	rdfs:domain schema:Movie;

mcb:hasMovieHistory a rdf:Property;
	rdfs:comment "A users history of watched movies";
	rdfs:label "MovieHistory";
	rdfs:type rdf:Bag;
	rdfs:domain mcb:User;
	
```

### Exploratory SparQL Queries

#### The distinct wikidata types that may be aligned with the types in your dataset (advanced query)

#### Total number of triples

```
SELECT (COUNT(?s) AS ?triples)
WHERE {
    ?s ?p ?o
}
```

#### Total number of instantiations

```
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT (COUNT(?s) AS ?instances)
WHERE {
    ?s a ?c .
    ?c a owl:Class
}
```

#### Total number of distinct classes

```
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT (COUNT(DISTINCT ?c) AS ?classes)
WHERE {
    ?c a owl:Class
}
```

#### Total number of distinct properties

```
SELECT (COUNT(DISTINCT ?p) AS ?properties)
WHERE {
    [] ?p []
}
```

#### List of all classes used in your dataset per data source (see named graphs)

```
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT DISTINCT (?g AS ?graphs) (?c AS ?classes)
WHERE {
    GRAPH ?g {
        ?c a owl:Class
    }
}
```

#### List of all properties used in your dataset per data source

```
SELECT DISTINCT (?g AS ?graphs) (?p AS ?properties)
WHERE {
    GRAPH ?g {
        [] ?p []
    }
}
```

#### Total number of instances per class per data source (reasoning on and off)

```
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT ?c (COUNT(?s) AS ?instances)
WHERE {
    GRAPH ?g {
        ?s a ?c .
        ?c a owl:Class
    }
}
GROUP BY (?c)
```

#### Total number of distinct subjects per property per data source 

```
SELECT (?p AS ?properties) (COUNT(DISTINCT ?s) AS ?subjects)
WHERE {
    GRAPH ?g {
        ?s ?p []
    }
}
GROUP BY (?p)
```

#### Total number of distinct objects per property per data source

```
SELECT (?p AS ?properties) (COUNT(DISTINCT ?o) AS ?objects)
WHERE {
    GRAPH ?g {
        [] ?p ?o
    }
}
GROUP BY (?p)
```

#### Distinct properties used on top 5 classes in terms of amount of instances (reasoning on and off)

```
PREFIX owl: <http://www.w3.org/2002/07/owl#>

SELECT DISTINCT (?p AS ?properties) (?c AS ?classes) (COUNT(?s) AS ?instances)
WHERE {
    ?s ?p ?c .
    ?c a owl:Class .
    ?s a ?c
}
GROUP BY ?p ?c
ORDER BY DESC COUNT(?s)
LIMIT 5
```

## Natural Language Processing

### npm natural

- [Text tagger](https://github.com/NaturalNode/natural#pos-tagger)
- [Automatically Constructing a Dictionary for Information Extraction Tasks](https://www.cs.utah.edu/~riloff/pdfs/aaai93.pdf)

### POS tagger

|tag |meaning              |examples  |
|:--:|:-------------------:|:--------:|
|CC  | Coord Conjunction   |and,but,or|
|CD  | Cardinal number     |one,two   |
|DT  | Determiner          |the,some  |
|EX  | Existential there   |there     |
|FW  | Foreign Word        |mon dieu  |
|IN  | Preposition         |of,in,by  |
|JJ  | Adjective           |big       |
|JJR | Adj., comparative   |bigger    |
|JJS | Adj., superlative   |biggest   |
|LS  | List item marker    |1,One     |
|MD  | Modal               |can,should|
|NN  | Noun, sing. or mass |dog       |
|NNP | Proper noun, sing.  |Edinburgh |
|NNP |S Proper noun, plural|Smiths    |
|NNS | Noun, plural        |dogs      |
|POS | Possessive ending   |O's       |
|PDT | Predeterminer       |all, both |
|PP$ | Possessive pronoun  |my,one's  |
|PRP | Personal pronoun    |I,you,she |
|RB  | Adverb              |quickly   |
|RBR | Adverb, comparative |faster    |
|RBS | Adverb, superlative |fastest   |
|RP  | Particle            |up,off    |
|SYM | Symbol              |+,%,&     |
|TO  | ÒtoÓ                |to        |
|UH  | Interjection        |oh, oops  |
|VB  | verb, base form     |eat       |
|VBD | verb, past tense    |ate       |
|VBG | verb, gerund        |eating    |
|VBN | verb, past part     |eaten     |
|VBP | Verb, present       |eat       |
|VBZ | Verb, present       |eats      |
|WDT | Wh-determiner       |which,that|
|WP  | Wh pronoun          |who,what  |
|WP$ | Possessive-Wh       |whose     |
|WRB | Wh-adverb           |how,where |
|,   | Comma               |,         |
|.   | Sent-final punct    |. ! ?     |
|:   | Mid-sent punct.     |: ; Ñ     |
|$   | Dollar sign         |$         |
|#   | Pound sign          |#         |
|"   | quote               |"         |
|(   | Left paren          |(         |
|)   | Right paren         |)         |

[Table is from here.](https://github.com/dariusk/pos-js)

## Response Sentence Creation

- [npm naturals bayesian classifier](https://github.com/NaturalNode/natural#bayesian-and-logistic-regression)
