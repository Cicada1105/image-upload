const http = require('http');

const { handleCORS, retrieveBodyData, convertToImage } = require('./utils');

const PORT = process.env.PORT || 2020;
const HOST = 'localhost';

const server = http.createServer((req,res) => {
	res.setHeader( 'Access-Control-Allow-Origin', '*' );
	/*
		URL Path should be in the format /image-upload or /image-upload/img-name.[file extension]
		req.url.split('/') -> [ '', 'image-upload', ... ]
	*/
	let urlPaths = req.url.split('/');

	if ( (req.method === 'OPTIONS') && ( req.headers['sec-fetch-mode'] === 'cors' ) ) {
		handleCORS( req, res );
	}
	switch( urlPaths.splice(0,2).join('') ) {
		case 'upload-image' :
			// Ensure request is a post request and nothing else exists in the URL
			if ( (req.method === "POST") && (urlPaths.length === 0) ) {
				retrieveBodyData(req).then( data => {
					let { fileName, fileType, fileData } = data;

					let imageSrc = convertToImage({ fileType, fileData });
					res.end( JSON.stringify({ msg: 'Success', image: `http://${HOST}:${PORT}/images/${imageSrc}` }) );
				}).catch( err => {
					res.end( JSON.stringify({ msg: err }) );
				})
			}
			else if ( req.method === 'GET' ) {
				let expectedImagePth = urlPaths.splice(0,1).join('');

				res.end(JSON.stringify({ msg: 'Retrieve image'} ))
			}
		break;
	}
});

server.listen(PORT,HOST,() => {
	console.log(`Listening on http://${HOST}:${PORT}`);
});