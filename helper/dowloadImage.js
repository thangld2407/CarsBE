const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

function convertImageToLinkServer(url) {
	const ext = path.extname(url);
	const protocol = new URL(url).protocol;
	let client = protocol.includes('https') ? https : http;
	const file = fs.createWriteStream(
		path.join(__dirname, `../public/uploads/upload-${Date.now()}${ext}`)
	);
	client.get(url, function (response) {
		response.pipe(file);
	});
	let link = `/uploads/${path.basename(file.path)}`;
	return link;
}

module.exports = convertImageToLinkServer;
