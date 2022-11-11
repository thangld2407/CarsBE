const puppeteer = require('puppeteer');

function htmlToPdf(url) {
	return new Promise(async (resolve, reject) => {
		try {
			const browser = await puppeteer.launch();
			const page = await browser.newPage();
			await page.goto(url, { waitUntil: 'networkidle2' });
			const pdf = await page.pdf({
				format: 'A4',
				path: `./public/uploads/${Date.now()}.pdf`
			});
			await browser.close();
			resolve(pdf);
		} catch (error) {
			reject(error);
		}
	});
}

htmlToPdf('https://www.djauto.co.kr/car/carViewFrameUsedCarCheck.html?checkFlag=424935')
	.then(pdf => {
		console.log('pdf created');
	})
	.catch(error => {
		console.log(error);
	});
