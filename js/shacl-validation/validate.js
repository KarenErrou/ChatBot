const fs = require('fs');
const chalk = require('chalk');
const shacl = require('./index.js');

shacl.validate({
	graph: fs.readFileSync(process.argv[2], 'utf8'),
	shapes: fs.readFileSync('./shacl.ttl', 'utf8')
}, function(err, report) {

	if (err) {
		console.log(err);
	} else {
		if (report.conforms())
			console.log(chalk.green('[TEST]: '+process.argv[2]+'\t[OK]'));
		else
			console.log(chalk.red('[TEST]: '+process.argv[2]+'\t[FAIL]'));
		//console.log("Conforms? " + report.conforms());
		//if (report.conforms() === false) {
		//	report.results().forEach(function(result) {
		//		console.log(" - Severity: " + result.severity() + " for " + result.sourceConstraintComponent());
		//	});
		//}
	}
});
