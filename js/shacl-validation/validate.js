const fs = require('fs');
const chalk = require('chalk');
const shacl = require('./index.js');

shacl.validate({
	graph: fs.readFileSync(process.argv[2], 'utf8'),
	shapes: fs.readFileSync(process.argv[3], 'utf8')
}, function(err, report) {

	if (err) {
		console.log(err);
	} else {
		if (report.conforms()) {
			console.log(chalk.green('[TEST]: '+process.argv[2]+'\t[OK]'));
        } else {
			console.log(chalk.red('[TEST]: '+process.argv[2]+'\t[FAIL]'));
            console.log(report);
        }
	}
});
