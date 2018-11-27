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
		callback(JSON.parse(result));
	})
	.fail(function(xhr) {
		console.log(xhr);
	});
}
