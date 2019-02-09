var annotator = require('./annotate.js');

annotator.annotate({text: "This movie is dumb. For real it is the most horrible thing that was ever made."}, function(err, result){
	console.log(result);
});

annotator.annotateAsync({text: "This movie is dumb. For real it is the most horrible thing that was ever made."})
.then(function(result){
    console.log(result);
})
.catch(function(err){
    console.log(err);
});
