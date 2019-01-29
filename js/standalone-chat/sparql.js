/* Server specific - change this to your config! */
var endpoint = 'http://localhost:7200/repositories/productionV2';

exports.getEmotionCategory = function(emotion) {
    return {
        'endpoint': endpoint,
        'query':
            'PREFIX skos: <http://www.w3.org/2004/02/skos/core#>'+
            'select ?category ?subcategory where {'+
            '    <http://gsi.dit.upm.es/ontologies/wnaffect/ns#' +
                    emotion.toLowerCase() + '>'+
            '       skos:broaderTransitive ?subcategory .'+
            '    ?subcategory skos:broaderTransitive ?category .'+
            '} limit 1'
    }
}

/* Sample Query fetching Movie annotated with emotion */
exports.getMoviePerEmotion = function(emotion) {
    return {
        'endpoint': endpoint,
        'query':
            'PREFIX schema: <http://schema.org/> ' +
            'PREFIX onyx: <http://www.gsi.dit.upm.es/ontologies/onyx/ns#> ' +
            'PREFIX wnaffect: <http://www.gsi.dit.upm.es/ontologies/wnaffect/ns#>' +
            'PREFIX mcb: <http://movie.chatbot.org/>' +
            'SELECT (?m As ?movie) ?id ?title ?duration' +
                    '?year ?desc ?rtg ?img ' +
            'WHERE { ' +
            '   ?m mcb:hasId ?id . ' +
            '   ?m mcb:hasTitle ?title . ' +
            '   ?m schema:duration ?duration . ' +
            '   ?m schema:dateCreated ?year . ' +
            '   ?m schema:text ?desc . ' +
            '   ?m schema:aggregateRating ?rtg . ' +
            '   ?m schema:image ?img . ' +
	    '   FILTER( ?img != "https://static.metacritic.com/images/products/movies/250h-movie.jpg") . ' +
            '   ?m a schema:Movie . ' +
            '   ?s a onyx:EmotionSet . ' +
            '   ?s onyx:describesObject ?m . ' +
            '   ?s onyx:hasEmotion ?e . ' +
            '   ?e onyx:hasEmotionCategory wnaffect:' + emotion +
            '} ORDER BY RAND() LIMIT 1'
    }
}

/* Query for dbpedia */
exports.getDBpediaMovieData = function(movieId) {
    return {
        'endpoint': endpoint,
        'query':
            'PREFIX mcb: <http://movie.chatbot.org/>' +
            'PREFIX owl: <http://www.w3.org/2002/07/owl#>' +
            'PREFIX dbo: <http://dbpedia.org/ontology/>' +
            'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>' +
            'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>' +
            'SELECT ?title ?director' +
            '       (xsd:float(?dur)/xsd:float(60) AS ?duration)' +
            '       ?desc ' +
            'WHERE {' +
            '   ?m mcb:hasId "' + movieId + '" .' +
            '   ?m owl:sameAs ?md .' +
            '   SERVICE <http://dbpedia.org/sparql> {' +
            '       ?md rdfs:label ?title .' +
            '       FILTER (LANG(?title) = "en") .' +
            '       ?md dbo:director ?dir .' +
            '       ?dir dbo:birthName ?director .' +
            '       ?md dbo:runtime ?dur .' +
            '       ?md rdfs:comment ?desc .' +
            '       FILTER (LANG(?desc) = "en")' +
            '    }' +
            '} LIMIT 1'
    }
}

/* Getting sample emotion via category */
exports.getEmotionsOfCategory = function(emotionCategory) {
    return {
        'endpoint': endpoint,
        'query':
            'PREFIX skos: <http://www.w3.org/2004/02/skos/core#>' +
            'PREFIX onyx: <http://gsi.dit.upm.es/ontologies/onyx/ns#>' +
            'select DISTINCT ?emo where {' +
            '   ?e a onyx:EmotionCategory .' +
            '   ?e skos:broaderTransitive ' +
            '   <http://gsi.dit.upm.es/ontologies/wnaffect/ns#' +
                 emotionCategory + '> .' +
            '   ?e skos:prefLabel ?emo .' +
            '}'
    }
}

exports.isEmotionValid = function(emotion) {
    return {
        'endpoint': endpoint,
        'query':
            'PREFIX wna: <http://www.gsi.dit.upm.es/ontologies/wnaffect/ns#>' +
            'ASK { ?s ?p wna:' + emotion + ' }'
    }
}

exports.getUserData = function(nickname) {
    return {
        'endpoint': endpoint,
	'query':
	    'PREFIX mcb: <http://movie.chatbot.org/> '+
	    'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> '+
	    'PREFIX owl: <http://www.w3.org/2002/07/owl#> '+
	    'PREFIX schema: <http://schema.org/> '+
	    'select ?date ?text ?author where { '+
	    '    ?s rdf:type mcb:User . '+
	    '    ?s mcb:hasNickName "'+nickname+'" . '+
	    '    ?s mcb:hasChatLog ?l . '+
	    '    ?l mcb:hasPartOfChat ?p . '+
	    '    ?p schema:dateCreated ?date . '+
	    '    ?p schema:text ?text . '+
	    '    ?p schema:author ?author '+
	    '} order by ?date '
    }
}

/*
exports.putUserData = function(nickname) {
    return {
        'endpoint': endpoint,
	'query':
	    'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
	    'PREFIX mcb: <http://movie.chatbot.org/> ' +
	    'INSERT DATA { ' +
	    //'    GRAPH <http://movie.chatbot.org/> { ' +
	    '        mcb:'+nickname+'sChatLog rdf:type mcb:ChatLog . ' +
	    '        mcb:'+nickname+' rdf:type mcb:User . ' +
	    '        mcb:'+nickname+' mcb:hasChatLog mcb:'+nickname+'sChatLog . ' +
	    '        mcb:'+nickname+' mcb:hasNickName "'+nickname+'" ' +
	    //'    }' +
	    '}'
    }
}
*/

var http = require('http');
var querystring = require('querystring');

exports.putPartOfChat = function(nickname, text, author, callback) {

    let timestamp = Date.now();

    let query = querystring.stringify({
        'update':
	    'BASE <http://movie.chatbot.org> ' +
            'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
            'PREFIX mcb: <http://movie.chatbot.org/> ' +
            'PREFIX schema: <http://schema.org/> ' +
            'INSERT DATA { ' +
            '        <#'+nickname+timestamp+'> rdf:type mcb:PartOfChat . ' +
            '        <#'+nickname+timestamp+'> schema:text "'+text+'" . ' +
            '        <#'+nickname+timestamp+'> schema:dateCreated "'+timestamp+'" . ' +
            '        <#'+nickname+timestamp+'> schema:author "'+author+'" . ' +
            '        <#'+nickname+'sChatLog> mcb:hasPartOfChat <#'+nickname+timestamp+'> . ' +
            '}'
    });

    // host specific options
    const options = {
        hostname: 'localhost',
        port: 7200,
        path: '/repositories/productionV2/statements',
        method: 'POST',
        headers: {
            'Accept': 'text/plain',
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
		    
    req.on('error', (e) => {
        console.error('GraphDB Error: ' + e.message);
        callback(null);
    });
    
    req.write(query);
    req.end();
}

exports.putUserData = function(nickname, author, callback) {

    let timestamp = Date.now();

    let query = querystring.stringify({
        'update':
	    'BASE <http://movie.chatbot.org> ' +
            'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
            'PREFIX mcb: <http://movie.chatbot.org/> ' +
            'PREFIX schema: <http://schema.org/> ' +
            'INSERT DATA { ' +
            '        <#'+nickname+'sChatLog> rdf:type mcb:ChatLog . ' +
            '        <#'+nickname+'> rdf:type mcb:User . ' +
            '        <#'+nickname+'> mcb:hasChatLog <#'+nickname+'sChatLog> . ' +
            '        <#'+nickname+'> mcb:hasNickName "'+nickname+'" . ' +
            '        <#'+nickname+timestamp+'> rdf:type mcb:PartOfChat . ' +
            '        <#'+nickname+timestamp+'> schema:text "Welcome '+nickname+'!" . ' +
            '        <#'+nickname+timestamp+'> schema:dateCreated "'+timestamp+'" . ' +
            '        <#'+nickname+timestamp+'> schema:author "'+author+'" . ' +
            '        <#'+nickname+'sChatLog> mcb:hasPartOfChat <#'+nickname+timestamp+'> . ' +
            '}'
    });

    // host specific options
    const options = {
        hostname: 'localhost',
        port: 7200,
        path: '/repositories/productionV2/statements',
        method: 'POST',
        headers: {
            'Accept': 'text/plain',
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
		    
    req.on('error', (e) => {
        console.error('GraphDB Error: ' + e.message);
        callback(null);
    });
    
    req.write(query);
    req.end();
}
