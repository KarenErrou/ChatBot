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

/* Socket Connection */
io.on('connection', function(socket) {
    socket.emit('message', { 'user':'Trumpy', 'msg':'Wecome!' });

    /* Response */
    socket.on('message', function(data) {
        // send message to everybody but sender
        socket.broadcast.emit('message', data);

        // respond with trumpy message
        socket.emit('message', { 'user':'Trumpy', 'msg':markov.walk() });

        // extract emotion and check for possible movie
        var emotion = bayes.classify(data.msg);
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

    socket.on('disconnect', function() {
        console.log('disconnected');
    });
});

/* Listen to Port 1337 */
server.listen(1337, function() {
    console.log('listening');
});
