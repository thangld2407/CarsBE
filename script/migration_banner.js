require('dotenv').config();
const { connectToDB } = require('../utils/db');
const HomeModel = require('../model/HomeModel');
connectToDB()
	.then(async _ => {
		await Migration();
	})
	.catch(err => {
		console.log(err);
	});

async function Migration() {
	try {
		const has_banner = await HomeModel.findOne({ is_banner: true });
		if (!has_banner) {
			const newData = new HomeModel({
				is_banner: true,
				image: '/assets/images/banner.jpg'
			});
			await newData.save();
			console.log('Tạo banner thành công');
		} else {
			console.log('Banner đã lưu trước đó');
		}
	} catch (error) {
		console.log(error);
	}

	process.exit(0);
}
