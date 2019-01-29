var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var markov = require('../markov-js/markov.js');
var bayes = require('../nlp/bayes.js');
var graphdb = require('../graphdb/index.js');
var sparql = require('./sparql.js');

/* App Settings */
app.use('/public', express.static(__dirname + '/public'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

/* web service endpoints */
app.get('/api/v1', function(req, res){
    res.sendFile(__dirname + '/public/schema/entrypoint.json');
});

/*REST API: get list of movies */
app.get('/api/v1/movies', function(req, res){

    let response = {
        "@context": "http://schema.org",
	"@type": "Collection",
	"@id": "/api/v1",
	"members": []
    };
    graphdb.query(sparql.getSomeMovies(), function(data){
        
        data.results.bindings.forEach(function(entry){
		response.members.push({
			"@id": "/api/v1/movies/" + entry.id.value,
			"@type": "schema:Movie"
		
		});
	});

        /* get list of movie ids here */
        res.send(response);
    });
});

/* REST API: get information about specific movie here */
app.get('/api/v1/movies/:id', function(req, res){
    graphdb.query(sparql.getMovieAPI(req.params.id), function(data){
	res.send({
		"@context": "http://schema.org",
		"@type": "Movie",
		"@id": "/api/v1",
		"title": data.results.bindings[0].title.value,
		"potentialAction": {
			"@type": "WatchAction",
			"target": "https://www.imdb.com/title/"+req.params.id+"/videogallery?ref_=tt_pv_vi_sm"
		}
	
	});
    });
});

/* Users partaking in the Chat */
var users = { };

/* Emotion categories (currently hard coded) */
var emotionCategories = [
    'ambiguous-emotion',
    'neutral-emotion',
    'positive-emotion',
    'negative-emotion',
];

/* Socket Connection */
io.on('connection', function(socket) {
    /* Add new user to the Chat */
    socket.on('join', function(data) {
        // welcome user and add to users list
        let nickname = data.user;

        graphdb.query(sparql.getUserData(nickname), function(data){

		if (data.results.bindings.length == 0) {

			console.log('Adding new user: ' + nickname);
			sparql.putUserData(nickname, 'Trumpy', function(data){
				
				/* this callback can't be called on update requests
				 * because graphdb sends no response */
				console.log('SUCCESS ADDING: ' + nickname);
			});
		
			io.emit('message', { 'user': 'Trumpy',
		         		     'msg': 'Welcome ' + nickname + '!' });
		
		} else {
			data.results.bindings.forEach(function(entry){
				console.log(entry);
				io.emit('message', {
					'user': entry.author.value,
					'msg': entry.text.value
				});
			
			});
		}

		users[socket.id] = nickname;
	});

    });

    /* Response */
    socket.on('message', function(data) {
        // send message to everybody but sender
        socket.broadcast.emit('message',{ 'user': users[socket.id],
                                          'msg': data.msg});

        sparql.putPartOfChat(users[socket.id], data.msg, users[socket.id], function(data){
		/* not reachable */
		console.log(data);
	});
	
    // respond with trumpy message
	let resp = markov.walk();
        io.emit('message', { 'user': 'Trumpy', 'msg': resp });
        sparql.putPartOfChat(users[socket.id], resp, 'Trumpy', function(data){
		/* not reachable */
		console.log(data);
	});

    // get emotion category and send it back
    let emotion = bayes.classify(data.msg);
    graphdb.query(sparql.getEmotionCategory(emotion), function(data) {
        if (data != null && data != undefined) {
            // categories and subcategories are ambiguous
            let category = data.results.bindings[0]['category'].value
                .replace('http://gsi.dit.upm.es/ontologies/wnaffect/ns#', '');
            let subcategory = data.results.bindings[0]['subcategory'].value
                .replace('http://gsi.dit.upm.es/ontologies/wnaffect/ns#', '');

            // we are always trying to get top level categories
            let topCategory = ''
            if (emotionCategories.includes(category)) {
                topCategory = category;
            } else if (emotionCategories.includes(subcategory)) {
                topCategory = subcategory;
            }

            // need the other categories for requests
            let otherCategories = [];
            for (let i in emotionCategories) {
                if (emotionCategories[i] != topCategory) {
                    otherCategories.push(emotionCategories[i]);
                }
            }

            // send emotion + category + other categories
            socket.emit('emotion', {
                'category': topCategory,
                'others': otherCategories,
                'emotion': emotion
            });
        }
    });

    });

    /* Helper function */
    function emitEmotionalMovie(emotion) {
        graphdb.query(sparql.getMoviePerEmotion(emotion), function(data) {
            if (data !== null && data !== undefined &&
                data.results.bindings.length > 0) {
                // process movie data for frontend
                let movieJSON = { };
                for (var i = 0; i < data.head.vars.length; i++) {
                    var key = data.head.vars[i];
                    movieJSON[key] = data.results.bindings[0][key].value;
                }

                graphdb.query(sparql.getDBpediaMovieData(movieJSON.id),
                              function(data) {
                    // add dbpedia data if available
                    if (data !== null && data !== undefined &&
                        data.results.bindings.length > 0) {
                        for (var i = 0; i < data.head.vars.length; i++) {
                            var key = data.head.vars[i];
                            movieJSON[key] = data.results.bindings[0][key].value;
                        }
                    }

                    socket.emit('movie', movieJSON);
                });
            }
        });
    }

    /* Emotion response (movie) */
    socket.on('emotion', function(data) {
        let emotion = data.emotion;
        emitEmotionalMovie(emotion);
    });

    /* Helper function */
    function emitValidEmotionalMovie(emotions, index) {
        graphdb.query(sparql.isEmotionValid(emotions[index]),
                      function(data) {
            // if emotion is valid -> emit, else recursion
            if (data.boolean) {
                emitEmotionalMovie(emotions[index]);
            } else if (++index < emotions.length) {
                emitValidEmotionalMovie(emotions, index);
            }
        });
    }

    /* Emotion category response (movie) */
    socket.on('emotionCategory', function(data) {
        let emotionCategory = data.emotionCategory;

        graphdb.query(sparql.getEmotionsOfCategory(emotionCategory),
                      function(data) {
            if (data !== null && data !== undefined &&
                data.results.bindings.length > 0) {
                // process emotions for sparql (uppercase error)
                let emotions = [];
                for (let i in data.results.bindings) {
                    let rawEmotion = data.results.bindings[i]['emo'].value;
                    let emotion = rawEmotion.replace(
                        'http://gsi.dit.upm.es/ontologies/wnaffect/ns#', '');
                    emotion = emotion.substr(0, 0) +
                          emotion[0].toUpperCase() +
                          emotion.substr(1);
                    let n = emotion.search('-') + 1;
                    emotion = emotion.substr(0, n) +
                          emotion[n].toUpperCase() +
                          emotion.substr(n + 1);
                    emotions.push(emotion);
                }
                
                emitValidEmotionalMovie(emotions, 0);
            }
        });
    });

    /* Disconnect */
    socket.on('disconnect', function() {
        // remove disconnected user
        delete users[socket.id];
    });
});

/* Listen to Port 1337 */
server.listen(1337, function() {
    console.log('listening');
});
