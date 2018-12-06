var SHACLValidator = require('./shacl-js/index.js')

/* params = {
 *	graph: the graph to be validated
 *	graph_type: the notation
 *	shapes: the shacl shapes to be validated against
 *	shapes_type: the shape's notation
 * }
 * */
exports.validate = function(params, callback){
	
	var shacl = new SHACLValidator();

	shacl.validate(params.graph,
			params.graph_type ? params.graph_type : "text/turtle",
			params.shapes,
			params.shapes_type ? params.shapes_type : "text/turtle",
			function (e, report) {

		callback(e, report);
	});
}
