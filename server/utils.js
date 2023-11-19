const fs = require('fs');
const { v4: uuid } = require('uuid');

function handleCORS(req,res) {
	const allowedMethods = [ 'GET', 'POST', 'DELETE' ];
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
function removeImage(imgFileName) {
	let serverImagePath = `${process.cwd()}/images/${imgFileName}`;

	let fileStats = fs.statSync( serverImagePath , { throwIfNoEntry: false });
	if ( fileStats ) {
		if ( fileStats.isFile() ) {
			fs.unlinkSync( serverImagePath );
			return true;
		}
		else {
			return false;
		}
	}
	else {
		return false;
	}
}

module.exports = { 
	handleCORS, retrieveBodyData, 
	convertToImage, removeImage
}