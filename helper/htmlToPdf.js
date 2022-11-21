const puppeteer = require('puppeteer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
var html_to_pdf = require('html-pdf-node');
const fs = require('fs');

function htmlToPdf(url) {
	return new Promise(async (resolve, reject) => {
		try {
			const browser = await puppeteer.launch({
				headless: true,
				args: ['--no-sandbox', '--disabled-setupid-sandbox'],
				ignoreHTTPSErrors: true
			});
			const page = await browser.newPage();

			page.on('dialog', dialog => {
				dialog.accept();
			});

			await page.goto(url, { waitUntil: 'networkidle2' });

			let hasIdPrint = await page.$('#idPrint');

			let pathName = `/uploads/performance-check-${uuidv4()}.pdf`;

			if (hasIdPrint) {
				html_to_pdf
					.generatePdf(
						{
							url: url
						},
						{
							format: 'A4'
						}
					)
					.then(pdfBuffer => {
						fs.writeFileSync(path.join(__dirname, `../public${pathName}`), pdfBuffer);
						resolve(pathName);
					})
					.catch(err => {
						reject(err);
					});
			} else {
				resolve(null);
			}
		} catch (error) {
			reject(error);
		}
	});
}

module.exports = htmlToPdf;
