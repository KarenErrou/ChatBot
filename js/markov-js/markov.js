let dag = require('./dag.js');

//dag.load();

require('./raw.json').trump.forEach(function(entry){
	dag.train(entry);
});

//dag.print();
dag.save();

/*setInterval(function(){
	console.log(dag.walk());
}, 1000);*/

exports.create = function() {
	dag.load();
}

exports.train = function(text){
	dag.train(text);
	dag.save();
}

exports.walk = function(){
	return dag.walk();
}
