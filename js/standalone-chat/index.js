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

/* Users partaking in the Chat */
var users = { }

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

        // extract emotion and check for possible movie
        let emotion = bayes.classify(data.msg);
        graphdb.query(sparql.getMoviePerEmotion(emotion), function(data) {
            if (data !== null && data !== undefined) {
                // process movie data for frontend
                var movieJSON = { };
                for (var i = 0; i < data.head.vars.length; i++) {
                    var key = data.head.vars[i];
                    movieJSON[key] = data.results.bindings[0][key].value;
                }
                socket.emit('movie', movieJSON);
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
