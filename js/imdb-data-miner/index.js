const request = require("request");
const rp = require("request-promise");

// virtual dom
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var targets_file = 'targets.json';
var tags_file = 'tags.json';
process.argv.forEach(function (val, i, array){
	if (i == 2)
		targets_file = val;
	if (i == 3)
		tags_file = val;
});

// target urls
const targets = require('./'+targets_file);
// what to extract
const tags = require('./'+tags_file).object;

targets.paths.forEach(function(path, i, array){

	var sample = {
		primary: [],
		secondary: []
	};

	// promising request to target url
	rp(targets.base + path + targets.postfix)
	.then(function(body) {
	
		if (body == null || body == undefined) return;

		const dom = new JSDOM(body);
		global.$ = require("jquery")(dom.window);

		tags.get_text.forEach(function(item){
			$(item).each(function(i, o){
				sample.primary.push($(this).text());
			});
		});

		tags.get_attr.forEach(function(item){
			sample.primary.push($(item[0]).attr(item[1]));
		});

		var sec = [];
		tags.subobjects.forEach(function(obj){

			obj.get_text.forEach(function(item){
				$(item).each(function(i, o){
					sec.push($(this).text());
				});
			});

			obj.get_attr.forEach(function(item){
				$(item[0]).each(function(i, o){
					sec.push($(this).attr(item[1]));
				});
			});

		});
		sample.secondary = sec;
		return sample;

	})
	.then(function (sample) {
		const fs = require('fs');
		fs.writeFile(targets.savedir+path+'.json', JSON.stringify(sample), 'utf8', (err)=>{
			if (err) throw err;
		});
	})
	.catch(function (err) {
		console.log("[ERROR] " + err);
	});	
});
