const puppeteer = require('puppeteer');
const path = require('path');
function htmlToPdf(url) {
	return new Promise(async (resolve, reject) => {
		try {
			const browser = await puppeteer.launch();
			const page = await browser.newPage();

			page.on('dialog', dialog => {
				dialog.accept();
			});

			await page.goto(url, { waitUntil: 'networkidle2' });

			let hasIdPrint = await page.$('#idPrint');

			if (hasIdPrint) {
				const pathName = `/uploads/performance-check-${Date.now()}-${Math.floor(
					Math.random() * 1000
				)}.pdf`;
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
