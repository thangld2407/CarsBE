const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

function convertImageToLinkServer(url) {
	let ext = path.extname(url);

	if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif' || ext === '.JPG') {
		ext = '.webp';
	}
	const protocol = new URL(url).protocol;
	let client = protocol.includes('https') ? https : http;
	const file = fs.createWriteStream(
		path.join(__dirname, `../public/uploads/upload-${Date.now()}-${Math.random() * 100}${ext}`)
	);
	client.get(url, function (response) {
		response.pipe(file);
	});
	let link = `/uploads/${path.basename(file.path)}`;
	return link;
}

module.exports = convertImageToLinkServer;
