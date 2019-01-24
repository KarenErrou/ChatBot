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
        io.emit('message', { 'user': 'Trumpy',
                             'msg': 'Welcome ' + nickname + '!' });
        users[socket.id] = nickname;
    });

    /* Response */
    socket.on('message', function(data) {
        // send message to everybody but sender
        socket.broadcast.emit('message',{ 'user': users[socket.id],
                                          'msg': data.msg});

        // respond with trumpy message
        io.emit('message', { 'user': 'Trumpy', 'msg': markov.walk() });

        // extract emotion and check for possible movie
        let emotion = bayes.classify(data.msg);
        graphdb.query(sparql.sampleQuery(emotion), function(data) {
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
