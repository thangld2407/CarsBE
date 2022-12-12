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
			await page.waitForSelector('#idPrint');
			await page.waitForSelector('.pageAfter');
			let pathname = `/uploads/performance-check-${uuidv4()}.webp`;

			const sc = await page.screenshot({
				path: path.join(__dirname, `../public/${pathname}`),
				fullPage: true
			});

			if (sc) {
				resolve(pathname);
			} else {
				resolve(null);
			}
			await browser.close();
		} catch (error) {
			htmlToPdf(url);
			reject(error);
		}
	});
}

module.exports = htmlToPdf;
