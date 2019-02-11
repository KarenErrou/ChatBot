let graphdb = require('../../graphdb/index.js');
let sparql = require('./sparql.js');

module.exports = function(config){

    /* REST API: get list of movies */
    config.express.get('/api/v1/movies', function(req, res){
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
    config.express.get('/api/v1/movies/:id', function(req, res){
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
}
