var Miner = require('./index.js');

var i = 563;
var max = 6800;

setInterval(function(){

	if (i>max) return;

	var config = require('./config.json');
	config.targets = [];
	config.targets.push('wikidata/'+i+'.json');
	//const fs = require('fs');
	//fs.writeFileSync('config.json', JSON.stringify(config));

	Miner.mine(config);
	i++;
	console.log("We're at i="+i);
	console.log(" Where max="+max);
}, 15000);
