var najax = require('najax');
var token = require('./config.json').token;

exports.annotate = function(params, callback){

	najax({
		beforeSend: function(req) {
			req.setRequestHeader("Accept", "application/vnd.ontotext.ces.document+json");
			req.setRequestHeader("X-JwtToken", token);
		},
		url: 'https://tag.ontotext.com/ces-en/extract',
		contentType: 'text/plain',
		data: params.text,
		type: 'post'
	})
	.done(function(result) {
		callback(null, JSON.parse(result));
	})
	.fail(function(xhr) {
        callback(xhr, null);
	});
}

exports.annotateAsync = function(params){

	return new Promise(function(resolve, reject){ 
		najax({
			beforeSend: function(req) {
				req.setRequestHeader("Accept", "application/vnd.ontotext.ces.document+json");
				req.setRequestHeader("X-JwtToken", token);
			},
			url: 'https://tag.ontotext.com/ces-en/extract',
			contentType: 'text/plain',
			data: params.text,
			type: 'post'
		})
		.done(function(result) {
			resolve(JSON.parse(result));
		})
		.fail(function(xhr) {
			reject(xhr);	
		});
	});
}
