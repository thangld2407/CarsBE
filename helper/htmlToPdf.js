const puppeteer = require('puppeteer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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

			if (hasIdPrint) {
				const pathName = `/uploads/performance-check-${uuidv4()}.pdf`;
				await page.pdf({
					format: 'A4',
					path: `./public${pathName}`
				});
				await browser.close();
				resolve(pathName);
			} else {
				resolve(null);
			}
		} catch (error) {
			htmlToPdf(url);
			reject(error);
		}
	});
}

module.exports = htmlToPdf;
