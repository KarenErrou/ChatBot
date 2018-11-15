const SparqlClient = require('sparql-client-2');
const SPARQL = SparqlClient.SPARQL;

const config = require('./config.json');
const endpoint = config.base.local + config.test2;
 
const client = new SparqlClient(endpoint);
 
const query = require('./queries.json');
query.demo.forEach(function(q){
	client.query(q)
		.execute()
		.then(function (results) {
			console.dir(results, {depth: null});
		})
		.catch(function (error) {
			console.log(error);
		});
})
