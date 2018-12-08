var Miner = require('./index.js');

var i = 902;
var max = 2409;

setInterval(function(){

	if (i>max) return;

	var config = require('./config.json');
	config.targets = [];
	config.targets.push('wikidata/s'+i+'.json');
	//const fs = require('fs');
	//fs.writeFileSync('config.json', JSON.stringify(config));

	Miner.mine(config);
	i++;
	console.log("We're at i="+i);
	console.log(" Where max="+max);
}, 45000);
