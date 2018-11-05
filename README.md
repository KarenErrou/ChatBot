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


## 1 - Introduction

The goal of the proseminar is to create a chatbot that is able to perform emotional reasoning.

> Emotional reasoning is a cognitive process by which a person concludes that his/her emotional reaction proves something is true, regardless of the observed evidence.
>
> -- <cite>Wikipedia</cite>

Reasoning processes of humans are mainly different than reasoning principles of machines, as humans made decisions basing not only on logics and facts, but basing on emotions, biases and comparatively very limited information. 

This project will collect and design ontologies and data representing human emotions and design reasoning mechanisms employing these. The reasoning mechanisms can be inbuilt in practical scenarios e.g. in online marketing - designing of a chatbot that appeals to emotions of humans and trying to change their behaviour. Or a character that goes beyond the "personal assistant" mode.


## 2 - Domain Overview

- [Linked Open Vocabularies.](https://lov.linkeddata.es/dataset/lov)
- [Google dataset search.](https://toolbox.google.com/datasetsearch)
- [CKAN (datasets search).](https://ckan.org)

### Movies and their Non-numerical reviews for Deducing Emotions

- [A small set of 16 movies](https://www.kaggle.com/jonsteve/user-reviews-of-16-movies-on-rotten-tomatoes)
- [A large set of movies usually used for binary sentiment classification (positive|negative)](http://www.cs.cornell.edu/people/pabo/movie-review-data/)
- [Another set of 25,000 movies also for binary sentiment classsification](http://ai.stanford.edu/~amaas/data/sentiment/)


## 3 - Initial Vocabulary Selection and Domain Specification

When it comes to vocabularies regarding emotions, there are a couple of choices. In the following segment we briefly discuss the vocabularies we looked at and why we landed on *Onyx* in combination with *WNAffect*.

### Emotion Markup Language (EmotionML)

[EmotionML](https://www.w3.org/TR/emotionml/)

EmotionML can be used in three different areas: manual annotation of data, automatic recognition of emotion-related states from user behavior and generation of emotion-related system behavior. While the last two points may sound well suited for our project, we found that *Onyx* was better suited for extracting emotions from text.

### Human Emotions Onotology (HEO)

[Human Emotions Ontology (HEO)](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.460.2603&rep=rep1&type=pdf)

HEO was created in order to annotate multimedia with emotions. Again, this sounds perfect for our project, but *Onyx* is still better suited when it comes to emotions extracted from text.

### Human Stress Ontology (HSO)

[Human Stress Ontology (HSO)](https://onlinelibrary.wiley.com/doi/epdf/10.1080/00050061003664811)

As its name already gives away, HSO is specifically designed to model stress factors and relations between said factors and their countermeasures. While HSO would be great for a project where movies are suggested in order to lower a user's stress level, it is not well suited for our project.

### Linked Data Models for Emotion and Sentiment Analysis W3C Community Group

[Linked Data Models for Emotion and Sentiment Analysis W3C Community Group](https://www.w3.org/community/sentiment/)

While the ideas of the W3C Community regarding modeling emotions sound great, the community does not seem to be very active.

### Onyx - An Emotion Modelling Ontology

- [Specification](http://www.gsi.dit.upm.es/ontologies/onyx/)
- [Onyx: A Linked Data Approach to Emotion Representation](http://oa.upm.es/37389/1/INVE_MEM_2015_190501.pdf)

Onyx was designed for emotions which have been extracted from text. This suits our needs perfectly, since we want to extract the user's emotional state from their chat messages and the emotional response to a movie from the movie's reviews.

### WordNet-Affect Taxonomy

[WordNet-Affect Taxonomy](http://www.gsi.dit.upm.es/ontologies/wnaffect/)

WNAffect was desigend to link words to affects (emotions). Again this makes a lot of sense for us and *Onyx* uses the terminology of WNAffect.

After deciding on how to model emotions, we did a mockup of what our knowledge graph might look like:

### Our Knowledge Graph

[A first glance of our graph model.](https://drive.google.com/file/d/1T9ww8kX9F9dy6ytcPoA-I7eyKJZaKS-5/view)

```
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns# >.
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
    rdfs:domain mcb:Movie;

mcb:hasMovieHistory a rdf:Property;
    rdfs:comment "A users history of watched movies";
    rdfs:label "MovieHistory";
    rdfs:type rdf:Bag;
    rdfs:domain mcb:User;
```

The prefix *mcb* stands for "movie chat bot" which is a placeholder for the parts which we wanted to model ourselves. However, since there are a lot of vocabularies for movies, it would have been senseless to create our own which is why we used *schema.org/Movie* in the final approach. This ontology covers pretty much every property of movies imaginable which is nice, but also too much for our project which is why we limited it to identifier, name, duration, release (dateCreated), description (text), aggregated rating (aggregateRating), actors, characters and poster (image).

### Our Crawler

Since we did not find a dataset including movies and their reviews, we had to crawl some review sites by ourselves. The crawler is written in javascript and works by looking for specified *html tags* in the page using *jQuery*. In order to make it suitable for multiple data sources/review sites, the crawler is initialized with a config via *config.json*, with tags via *movies.json* and *reviews.json* and with a list of targets via *target.json*.

The results for movies are stored in seperate jsons which are linked by the movies id. Later these jsons can be processed by our mapper in order to map the metadata to our ontology.

#### config.json

* target_entities (movies and reviews)
    - base: the base url of the movie review website
    - postfix: the sub path of the url which comes after the movie id
    - save_dir: the directory where the result jsons are going to be stored

* already_used_targets: used to keep track of retrieved movies
* to_be_used_targets: used to keep track of movies going to be fetched
* targets: list of movies which will be retrieved be the crawler when run
* targets_dir: directory of the target jsons

Example:

```
{
    "target_entities":{
        "movies":{
            "base":"https://www.imdb.com/title/",
            "postfix":"",
            "save_dir":"../../data/imdb/movies/",
            "tags":"./tags/movies.json"
        },
        "reviews":{
            "base":"https://www.imdb.com/title/",
            "postfix":"/reviews?ref_=tt_urv",
            "save_dir":"../../data/imdb/reviews/",
            "tags":"./tags/reviews.json"
        }
    },
    "already_used_targets":[],
    "to_be_used_targets":[],
    "targets":["starwars.json"],
    "targets_dir":"./targets/"
}
```

#### movies.json and reviews.json

* singular: items where a quantity of exactly 1 is expected
    - get_text: retrieve the text of a html tag
    - get_attr: retrieve the attribute of a html tag

* plural: items where a quantity of >1 is expected
    - get_text: retrieve the text of a html tag
    - get_attr: retrieve the attribute of a html tag

Example:

```
{
    "singular":{
        "get_text":{
            "movie-duration":"div.subtext time",
            "movie-rating-count":"span[itemprop='ratingCount']",
            "movie-rating-value":"span[itemprop='ratingValue']",
            "movie-best-rating":"span[itemprop='bestRating']",
            "movie-year":"span#titleYear a",
            "movie-director":"div.credit_summary_item a",
            "movie-description":"div.inline.canwrap p span"
        },
        "get_attr":{
            "movie-title":["meta[property='og:title']","content"],
            "movie-image":["meta[property='og:image']","content"],
            "movie-short-description":["meta[name='description']","content"],
            "movie-url":["meta[property='og:url']","content"],
            "movie-id":["meta[property='pageId']","content"]
        }
    },
    "plural":{
        "get_text":{
            "movie-character":"td.character a"
        },
        "get_attr":{
            "movie-actor-img":["td.primary_photo a img.loadlate","src"],
            "movie-actor":["td.primary_photo a img","alt"]
        }
    }
}
```

#### targets.json

A simple array containg movie ids (Example: starwars.json contains the ids of all Star Wars movies).

### Our Mapper

The mapper takes the jsons created by the crawler and puts all of the data into our knowledge graph. This process is actually very simple since the jsons contain simple dictionaries (key value pairs).

#### Movies

1. Iterate over all actors and create an instance of *schema:Person* for each actor
2. Create a *schema:aggregateRating* containing the number of ratings, the rating and the max. rating
3. Create an instance of *schema:Movie* and add all of the crawled metadata to it

#### Reviews

1. Create an entity of the review and add all of the crawled metadata to it
2. Create an *onyx:EmotionSet* which links an *wnaffect* emotion to the review
3. Create an analysis which describes how the *onyx:EmotionSet* was obtained (currently this is done randomly)

Example (sub graph of our knowledge graph):

```
@base <http://movie.chatbot.org/>.
@prefix schema: <http://schema.org/>.
@prefix onyx: <http://www.gsi.dit.upm.es/ontologies/onyx/ns#>.
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix prov: <http://www.w3.org/ns/prov#>.
@prefix wnaffect: <http://www.gsi.dit.upm.es/ontologies/wnaffect/ns#>.

<#Hate>
    onyx:hasEmotionCategory wnaffect:Hate.

< ... > // emotions left out for readability

<#EmiliaClarke>
    rdf:type schema:Person;
    schema:name "Emilia Clarke".

< ... > // actors left out for readability

<#tt3778644-aggregateRating>
    schema:ratingCount 166,212;
    schema:ratingValue 7.0;
    schema:bestRating 10;
    schema:itemReviewed <#tt3778644>.

<#tt3778644>
    rdf:type schema:Movie;
    schema:identifier "tt3778644";
    schema:name "Solo A Star Wars Story (2018)";
    schema:duration "2h15min";
    schema:dateCreated "2018";
    schema:text "Description...";
    schema:aggregateRating <#tt3778644-aggregateRating>;
    schema:actor "Emilia Clarke";
    < ... > // actors left out for readability
    schema:character "Qi'ra";
    < ... > // characters left out for readability
    schema:image "https://m.media-amazon.com/images/M/MV5BOTM2NTI3NTc3Nl5BMl5BanBnXkFtZTgwNzM1OTQyNTM@._V1_UY1200_CR90,0,630,1200_AL_.jpg".

<#tt3778644-poopville>
    schema:about <#tt3778644>;
    schema:author "poopville";
    schema:dateCreated "Mon Aug 06 2018 00:00:00 GMT+0200 (CEST)";
    schema:reviewRating 7;
    schema:headline "Review...".

<#tt3778644-poopville-sentiment>
    rdf:type onyx:EmotionSet;
    onyx:emotionText "Review...";
    onyx:describesObject <#tt3778644-poopville-sentiment>;
    onyx:hasEmotion <#Hate>;
    prov:Entity <#tt3778644-poopville>.

<#tt3778644-poopville-sentiment-analysis>
    onyx:algorithm "RNG";
    onyx:source "http://www.imdb.com/title/tt3778644/reviews";
    onyx:usesEmotionalModel "http://www.gsi.dit.upm.es/ontologies/wnaffect#WNAModel";
    prov:generated <#tt3778644-poopville-sentiment>.
```


## 4 - Exploratory Queries on the Loaded Dataset

#### The distinct wikidata types that may be aligned with the types in your dataset (advanced query)

#### Total number of triples

```
SELECT (COUNT(?s) AS ?triples)
WHERE {
    ?s ?p ?o
}
```

|        triples        |
|:---------------------:|
| "152198"^^xsd:integer |

#### Total number of instantiations

```
SELECT (COUNT(?s) AS ?instances)
WHERE {
    ?s a []
}
```

|       instances      |
|:--------------------:|
| "15449"^^xsd:integer |

#### Total number of distinct classes

```
SELECT (COUNT(DISTINCT ?c) AS ?classes)
WHERE {
    [] a ?c
}
```

|      classes      |
|:-----------------:|
| "10"^^xsd:integer |

#### Total number of distinct properties

```
SELECT (COUNT(DISTINCT ?p) AS ?properties)
WHERE {
    [] ?p []
}
```

|    properties     |
|:-----------------:|
| "34"^^xsd:integer |

#### List of all classes used in your dataset per data source (see named graphs)

```
SELECT DISTINCT (?g AS ?graphs) (?c AS ?classes)
WHERE {
    GRAPH ?g {
        [] a ?c
    }
}
```

| graphs                      | classes         |
|:----------------------------|:----------------|
| https://www.metacritic.com/ | schema:Movie    |
| https://www.metacritic.com/ | onyx:EmotionSet |
| https://www.imdb.com/       | schema:Person   |
| https://www.imdb.com/       | schema:Movie    |
| https://www.imdb.com/       | onyx:EmotionSet |

#### List of all properties used in your dataset per data source

```
SELECT DISTINCT (?g AS ?graphs) (?p AS ?properties)
WHERE {
    GRAPH ?g {
        [] ?p []
    }
}
```

| graphs                      | properties              |
|:----------------------------|:------------------------|
| https://www.metacritic.com/ | rdf:type                |
| http://imdb.com/            | rdf:type                |
| https://www.metacritic.com/ | onyx:hasEmotionCategory |
| http://imdb.com/            | onyx:hasEmotionCategory |
| ...                         | ...                     |

#### Total number of instances per class per data source (reasoning on and off)

```
SELECT DISTINCT (?g as ?graphs) (?c as ?classes) (COUNT(?s) AS ?instances)
WHERE {
    GRAPH ?g {
        ?s a ?c
    }
}
GROUP BY ?g ?c
```

##### Reasoning On

| graphs                      | classes         |           instances |
|:----------------------------|:----------------|--------------------:|
| https://www.metacritic.com/ | schema:Movie    |    "1"^^xsd:integer |
| https://www.metacritic.com/ | onyx:EmotionSet |   "43"^^xsd:integer |
| http://imdb.com/            | schema:Person   | "6712"^^xsd:integer |
| http://imdb.com/            | schema:Movie    |  "468"^^xsd:integer |
| http://imdb.com/            | onyx:EmotionSet | "8168"^^xsd:integer |

##### Reasoning Off

Did not seem to make a difference.

#### Total number of distinct subjects per property per data source 

```
SELECT DISTINCT (?g as ?graphs) (?p AS ?properties) (COUNT(DISTINCT ?s) AS ?subjects)
WHERE {
    GRAPH ?g {
        ?s ?p []
    }
}
GROUP BY ?g ?p
```

| graphs                      | properties              |             subjects |
|:----------------------------|:------------------------|---------------------:|
| https://www.metacritic.com/ | rdf:type                |    "44"^^xsd:integer |
| http://imdb.com/            | rdf:type                | "15348"^^xsd:integer |
| https://www.metacritic.com/ | onyx:hasEmotionCategory |    "29"^^xsd:integer |
| http://imdb.com/            | onyx:hasEmotionCategory |    "29"^^xsd:integer |
| ...                         | ...                     |                  ... |

#### Total number of distinct objects per property per data source

```
SELECT DISTINCT (?g as ?graphs) (?p AS ?properties) (COUNT(DISTINCT ?o) AS ?objects)
WHERE {
    GRAPH ?g {
        [] ?p ?o
    }
}
GROUP BY ?g ?p
```

| graphs                      | properties              |           objects |
|:----------------------------|:------------------------|------------------:|
| https://www.metacritic.com/ | rdf:type                |  "2"^^xsd:integer |
| http://imdb.com/            | rdf:type                |  "3"^^xsd:integer |
| https://www.metacritic.com/ | onyx:hasEmotionCategory | "29"^^xsd:integer |
| http://imdb.com/            | onyx:hasEmotionCategory | "29"^^xsd:integer |
| ...                         | ...                     |               ... |

#### Distinct properties used on top 5 classes in terms of amount of instances (reasoning on and off)

```
SELECT DISTINCT (?p AS ?properties)
WHERE {
    ?s ?p [] .
    ?s a ?c .
    {
        # sub query for top 5 classes in terms of amount of instances
        SELECT ?c (COUNT(?s) as ?count)
        WHERE {
            ?s a ?c
        }
        GROUP BY ?c
        ORDER BY DESC (COUNT(?s))
        LIMIT 5
    }
}
```

##### Reasoning On

|                       properties                       |
|:------------------------------------------------------:|
|                        rdf:type                        |
|                    onyx:emotionText                    |
|                  onyx:describesObject                  |
|                    onyx:hasEmotion                     |
|                      prov:Entity                       |
|                      schema:name                       |
|                   schema:identifier                    |
|                    schema:duration                     |
|                   schema:dateCreated                   |
|                      schema:text                       |
|                 schema:aggregateRating                 |
|                      schema:image                      |
|                      schema:actor                      |
|                    schema:character                    |
|                   rdfs:subPropertyOf                   |
| http://proton.semanticweb.org/protonsys#transitiveOver |
|                      rdfs:domain                       |
|                       rdfs:range                       |
|                     owl:inverseOf                      |

19 distinct properties used on top 5 classes in terms of amount of instances.

##### Reasoning Off

|       properties       |
|:----------------------:|
|        rdf:type        |
|    onyx:emotionText    |
|  onyx:describesObject  |
|    onyx:hasEmotion     |
|      prov:Entity       |
|      schema:name       |
|   schema:identifier    |
|    schema:duration     |
|   schema:dateCreated   |
|      schema:text       |
| schema:aggregateRating |
|      schema:image      |
|      schema:actor      |
|    schema:character    |

14 distinct properties used on top 5 classes in terms of amount of instances.


## 5 - Conclusion and Next Steps

Now that we gathered the data, the next logical step would be to find a way to translate the reviews into an annotation of emotions. However, we found that the quality of the reviews in regards of length and emotional wording varies a lot between data sources and also between authors. We will have to see how well these reviews are suited for our needs and maybe even involve movie scripts in order to obtain an annotation of emotions, which may give better results.

Whichever we choose, in the end we will also have to define a way to process natural language. This mechanism is important for the process of extracting an annotation of emotion from our data sources as well as for obtaining an emotional state from the user by processing their chat messages.

### Natural Language Processing

#### npm natural

- [Text tagger](https://github.com/NaturalNode/natural#pos-tagger)
- [Automatically Constructing a Dictionary for Information Extraction Tasks](https://www.cs.utah.edu/~riloff/pdfs/aaai93.pdf)

#### POS tagger

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

### Response Sentence Creation

- [npm naturals bayesian classifier](https://github.com/NaturalNode/natural#bayesian-and-logistic-regression)
