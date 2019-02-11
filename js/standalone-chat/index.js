var express = require('express');
var app = express();
var server = require('http').Server(app);

/* App Settings */
app.use('/public', express.static(__dirname + '/public'));

/* Listen to Port 1337 */
server.listen(1337, function() {
    console.log('listening');
});

/* CHAT UI */
var chat = require('./app/chat.js')({
    express: app,
    server: server
});
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

/* REST API */
var ws = require('./app/ws.js')({
    express: app
});
app.get('/api/v1', function(req, res){
    res.sendFile(__dirname + '/public/schema/entrypoint.json');
});
