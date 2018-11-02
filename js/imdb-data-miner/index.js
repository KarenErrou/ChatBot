const rp = require("request-promise");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// setup configs
var config = require('./config.json');

// target urls
var targets = [];
config.targets.forEach(function(file){

	var topic = require(config.targets_dir+file);
	topic.forEach(function(t){
		targets.push(t);
	});
});

/* append ids for further processing */
var file = '../../data/imdb/movies.json';
var ids = require(file);
targets.forEach(function(t){
	ids.push(t);
});
// TODO: make set out of movies.json to spare us some useless computation

var idsjson = JSON.stringify(ids);
const fs = require('fs');
fs.writeFile(file, idsjson, 'utf8', (err)=>{
	if (err) throw err;
});

/* get target entity information */
var entities = []
for (var key in config.target_entities) {

	// ignore meta properties
	if (!config.target_entities.hasOwnProperty(key))
		continue;
	var tags_file = config.target_entities[key].tags;
	config.target_entities[key].tags = require(tags_file);
	entities.push(config.target_entities[key]);
}

entities.forEach(function(entity){
	targets.forEach(function(target){

		rp(entity.base + target + entity.postfix)
			.then(function(body) {

				if (body == null || body == undefined)
					return;

				// virtual dom
				const dom = new JSDOM(body);
				global.$ = require("jquery")(dom.window);

				var sample = {}

				/* items where a quantity of exactly 1 is expected */
				var singular_tags = entity.tags.singular;
				for (var key in singular_tags.get_text) {

					// ignore meta properties
					if (!singular_tags.get_text.hasOwnProperty(key))
						continue;

					sample[key] = [];
					$(singular_tags.get_text[key]).each(function(){
						sample[key].push($(this).text());
					});
				}

				for (var key in singular_tags.get_attr) {
					
					// ignore meta properties
					if (!singular_tags.get_attr.hasOwnProperty(key))
						continue;

					sample[key] = [];
					var query = singular_tags.get_attr[key];
					sample[key].push($(query[0]).attr(query[1]));
				}

				/* items where a quantity of >1 is expected */
				var plural_tags = entity.tags.plural;
				for (var key in plural_tags.get_text) {

					// ignore meta properties
					if (!plural_tags.get_text.hasOwnProperty(key))
						continue;

					sample[key] = [];
					$(plural_tags.get_text[key]).each(function(){
						sample[key].push($(this).text());
					});
				}

				for (var key in plural_tags.get_attr) {
					
					// ignore meta properties
					if (!plural_tags.get_attr.hasOwnProperty(key))
						continue;

					sample[key] = [];
					var query = plural_tags.get_attr[key];
					$(query[0]).each(function(item){
						sample[key].push($(this).attr(query[1]));
					});
				}

				return sample;
			})
			.then(function(sample){

				var file = entity.save_dir+target+'.json';
				var samplejson = JSON.stringify(sample);
				const fs = require('fs');
				fs.writeFile(file, samplejson, 'utf8', (err)=>{
					if (err) throw err;
				});
			})
			.catch((err) => {
				console.log(err);
				//throw err;
			});	
	});
});
