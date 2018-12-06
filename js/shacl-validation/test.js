const fs = require('fs');
const shacl = require('./index.js');

try {

	shacl.validate({
		graph: fs.readFileSync('../../ontology/imdb/merged_imdb1.ttl', 'utf8'),
		shapes: fs.readFileSync('./shacl.ttl', 'utf8')
	}, function(err, report){

		if (err) {
			console.log(err);
		} else {
			console.log("Conforms? " + report.conforms());
			if (report.conforms() === false) {
				report.results().forEach(function(result) {
					console.log(" - Severity: " + result.severity() + " for " + result.sourceConstraintComponent());
				});
			}
		}
	});

} catch (e) {
	console.log(e);
}
