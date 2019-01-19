var http = require('http');
var querystring = require('querystring')

/* Returns a Movie annotated with the given Emotion via Callback */
exports.getMovieViaEmotion = function(emotion, callback) {

    // query which looks for movies annotated with given emotion
    var query = querystring.stringify({
        'query':
        'PREFIX schema: <http://schema.org/> ' +
        'PREFIX onyx: <http://www.gsi.dit.upm.es/ontologies/onyx/ns#> ' +
        'PREFIX wnaffect: <http://www.gsi.dit.upm.es/ontologies/wnaffect/ns#>' +
        'SELECT ?m ?id ?name ?dur ?year ?desc ?rtg ?img ' +
        'WHERE { ' +
        '   ?m schema:identifier ?id . ' +
        '   ?m schema:name ?name . ' +
        '   ?m schema:duration ?dur . ' +
        '   ?m schema:dateCreated ?year . ' +
        '   ?m schema:text ?desc . ' +
        '   ?m schema:aggregateRating ?rtg . ' +
        '   ?m schema:image ?img . ' +
        '   { ' +
        '       SELECT ?m ' +
        '       WHERE { ' +
        '           ?m a schema:Movie . ' +
        '           ?s a onyx:EmotionSet . ' +
        '           ?s onyx:describesObject ?m . ' +
        '           ?s onyx:hasEmotion ?e . ' +
        '           ?e onyx:hasEmotionCategory wnaffect:' + emotion +
        '       } LIMIT 1 ' +
        '   } ' +
        '}'
    });

    // host specific options
    const options = {
        hostname: 'localhost',
        port: 7200,
        path: '/repositories/movie-chatbot',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(query)
        }
    };

    // send request and return data via callback
    const req = http.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', function(data) {
            callback(data);
        });
    });

    // dirty error handling
    req.on('error', (e) => {
        console.error('GraphDB Error: ' + e.message);
        callback(null);
    });

    // write data to request body
    req.write(query);
    req.end();
}
