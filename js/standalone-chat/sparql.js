/* Server specific - change this to your config! */
var endpoint = 'http://localhost:7200/repositories/movie-chatbot';

/* Sample Query fetching Movie annotated with emotion */
exports.sampleQuery = function(emotion) {
    return {
        'endpoint': endpoint,
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
    }
}
