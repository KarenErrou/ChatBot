const fs = require('fs');
const annotator = require('./annotate.js');
const ids = require('../../data/imdb/movies.json');
//const ids = ["tt0110912"];

function getWord(text, start, end){
	
	return text.substring(start, end);
}

function annotate(id){

	let reviews;
	try {
		reviews = require('../../data/imdb/reviews/'+id+'.json');
		reviews = reviews["review-text"];
	} catch(e) {
		console.log(e);
		return;
	}

	/* reduce requests by combining the review texts */
	let combined;
	reviews.forEach(function(review){
		combined += review;	
	});

	annotator.annotate({text: combined}, function(err, result){

		if (err) {
			console.log(err);
			return;
		}

		let tags = [];
		//console.log(result);
		result["annotation-sets"].forEach(function(annotation){

			if (annotation.name != "Final") return;

			//console.log(annotation.annotation);
			annotation.annotation.forEach(function(tag){

				let t = {
					text: getWord(combined, tag.startnode, tag.endnode).toLowerCase(),
					type: tag.type,
					meta: {}
				};

				tag["feature-set"].forEach(function(feature){
					t.meta[feature.name.name] = feature.value.value
				});

				tags.push(JSON.stringify(t));
				//console.log(t);
			});
		});

		let tagSet = new Set(tags); 
		let arr = Array.from(tagSet);
		let objArr = [];
		arr.forEach(function(entry){
			objArr.push(JSON.parse(entry));
		});
		fs.writeFileSync('../../data/imdb/review-tags/'+id+'.json', JSON.stringify(objArr), 'utf8');
		//console.log(tagSet);
	});
}

var i = 115;
setInterval(function(){
	if (i < ids.length) {
		annotate(ids[i++]);
		console.log("at: "+i);
	}
}, 120000);
