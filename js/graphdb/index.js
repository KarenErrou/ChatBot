const SparqlClient = require('sparql-client-2');
const SPARQL = SparqlClient.SPARQL;

const config = require('./config.json');
const default_endpoint = config.base.local + config.repo.test2;
 
exports.query = function(request, callback) {

	var client;
	if (request.endpoint != null && request.endpoint != undefined)
		client = new SparqlClient(request.endpoint);
	else
		client = new SparqlClient(default_endpoint);

	client.query(request.query)
	.execute()
	.then(function(results){
		if (results != null && results != undefined)
			callback(results);
		else
			console.log("No results!");
	})
	.catch(function(error){
		console.log(error);
	});
}
