var bayes = require('bayes');

/* load classifier state from json */
function loadClassifier(){
	
	var stateJson = require('./classifier.json');
	return bayes.fromJson(JSON.stringify(stateJson));
}

/* save the classifiers state */
function saveClassifier(classifier){
	
	var fs = require('fs');
	fs.writeFileSync('./classifier.json',classifier.toJson(),'utf8');
}

/* train the model with the provided*/
exports.train = function(){

	var training = require('./training.json');

	var classifier = loadClassifier(); 
	training.emotions.forEach(function(emotion){
		classifier.learn(emotion.phrase, emotion.category);
	});

	saveClassifier(classifier);
}

/* classify some text */
exports.classify = function(text){
	
	var classifier = loadClassifier();
	return classifier.categorize(text);
}
