#!/bin/bash

graphs=("imdb" "metacritic" "wikidata" "dbpedia")

for graph in "${graphs[@]}"
do
	path="../../ontology/$graph/"
	for f in "$path"*.ttl
	do
		node validate.js "$f"
	done
done
