var natural = require("natural");
var tokenizer = new natural.WordTokenizer();
var path = require("path");
var fs = require('fs');

// NLP stuff
var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';

var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);


// IO stuff
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// tag read line
function readFiles(dirname, onFileContent, onError) {
	fs.readdir(dirname, function(err, filenames) {
		if (err) {
			onError(err);
			return;
		}
		filenames.forEach(function(filename) {
			fs.readFile(dirname + filename, 'utf-8', function(err, content) {
				if (err) {
					onError(err);
					return;
				}
				onFileContent(filename, content);
			});
		});
	});
}

readFiles("./resources/", (filename, content) => {
	console.log(filename);
	console.log(tagger.tag(tokenizer.tokenize(content)));
},
(err) => {
	console.log(err);
});

// tag read line
/*
   rl.on('line', (input) => {
   console.log("==============================");
   console.log("BOT SAYS:");
   console.log(`Received: ${input}`);
   console.log(tagger.tag(tokenizer.tokenize(input)));
   console.log("==============================");
   });
   */
