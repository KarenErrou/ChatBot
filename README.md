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

## Prerequisites

TODO

### npm natural

TODO

## Dataset

TODO

### Reads

[Google dataset search.](https://toolbox.google.com/datasetsearch)

[CKAN (datasets search).](https://ckan.org)

[Linked Open Vocabularies.](https://lov.linkeddata.es/dataset/lov)

## Natural Language Processing

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

### Reads

[Text tagger](https://github.com/NaturalNode/natural#pos-tagger)

[Automatically Constructing a Dictionary for Information Extraction Tasks](https://www.cs.utah.edu/~riloff/pdfs/aaai93.pdf)

## Reasoning

TODO

### Knowledge Graph

TODO

## Response Sentence Creation

TODO 

### Reads

[npm naturals bayesian classifier](https://github.com/NaturalNode/natural#bayesian-and-logistic-regression)
