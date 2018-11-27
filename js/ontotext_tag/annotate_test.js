var annotator = require('.annotate.js');

annotator.annotate({text: "This movie is dumb. For real it is the most horrible thing that was ever made."}, function(result){
	console.log(result);
});
