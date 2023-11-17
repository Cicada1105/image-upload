const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 2020;
const HOST = 'localhost';

const server = http.createServer((req,res) => {
	res.end("Working");
});

server.listen(PORT,HOST,() => {
	console.log(`Listening on http://${HOST}:${PORT}`);
});