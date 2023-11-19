
function handleCORS(req,res) {
	const allowedMethods = [ 'GET', 'POST' ];
	const allowedHeaders = [ 'origin', 'content-type', 'accept' ];

	let reqHeaders = req.headers;

	if ( allowedMethods.includes(reqHeaders['access-control-request-method']) && 
		allowedHeaders.includes(reqHeaders['access-control-request-headers']) ) {
		res.setHeader( 'Access-Control-Allow-Origin', '*' );
		res.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, DELETE' );
		res.setHeader( 'Access-Control-Allow-Headers', 'Origin, Content-Type, Accept' );

		res.end(JSON.stringify({ msg: 'CORS preflight handled' }));
	}
}

module.exports = {
	handleCORS
}