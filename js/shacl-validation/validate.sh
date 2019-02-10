#!/bin/bash

graphs=("imdb" "metacritic" "wikidata" "dbpedia")
shape="./shapes/movie.ttl"

for graph in "${graphs[@]}"
do
	path="../../ontology/$graph/"
	for f in "$path"*.ttl
	do
		echo $f $shape 
		node validate.js "$f" "$shape"
	done
done
