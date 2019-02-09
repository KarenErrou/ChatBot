#!/bin/bash

rm metacritic/merged_*

n_sources=120
chunk=25
new_f=0

for i in `seq 0 $n_sources`
do
	temp=$(($i+1))
	cond=$(($temp%25))
	if [ $cond -eq 0 ]
	then
		new_f=$(($new_f+1))
	fi
	cat metacritic/metacritic"$i".ttl >> metacritic/merged_metacritic"$new_f".ttl
done
