const fs = require('fs');
const { v4: uuid } = require('uuid');

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
function retrieveBodyData(req) {
	return new Promise(( resolve, reject ) => {
		let data = "";
		req.on( 'data', d => data += d );
		req.on( 'end', () => {
			let dataStr = data.toString();
			let parsedData = JSON.parse( dataStr );
			resolve( parsedData );
		});
		req.on( 'error', (e) => reject( e ) );
	});
}
function convertToImage({ fileType, fileData }) {
	let imgSouceAsBuffer = Buffer.from(fileData, 'base64');
	let newFileName = `${uuid()}.${fileType}`;
	let fileNamePath = `${process.cwd()}/images`;

	fs.writeFileSync( `${fileNamePath}/${newFileName}`, imgSouceAsBuffer );

	return newFileName;
}

module.exports = { handleCORS, retrieveBodyData, convertToImage }