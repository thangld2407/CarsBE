const convertImageToLinkServer = require('../../helper/dowloadImage');
const take_decimal_number = require('../../helper/floatNumberTwoCharacter');
const generateUUID = require('../../helper/generateUUID');
const SaleModel = require('../../model/SaleModel');

module.exports = async (req, res) => {
	let uuid = generateUUID();
	try {
		const data = req.body;
		let list_image_converted = [];

		const hasCarInDb = await CarModel.findOne({
			car_code: data.car_code.trim() + uuid
		});

		let isSaleOn = await SaleModel.find();
		let priceSale = 0;
		if (isSaleOn.length === 0) {
			priceSale = 0;
		} else {
			if (isSaleOn[0].is_sale) {
				priceSale = isSaleOn[0].sale_price / 100;
			} else {
				priceSale = 0;
			}
		}

		if (!hasCarInDb) {
			data?.listImage?.forEach(item => {
				let img = convertImageToLinkServer(item);
				list_image_converted.push(img);
			});
			let performance_check = '';
			const car = new CarModel({
				car_name: data.car_name.trim() + uuid,
				car_model: data.car_model.trim(),
				images: list_image_converted || [],
				price: data.price,
				car_code: data.car_code.trim(),
				license_plate: data.plate_number.trim(),
				year_manufacture: data.basic_inf.year_manufacture,
				distance_driven: data.basic_inf.distance_driven,
				fuel_type: data.basic_inf.fuel_type,
				gearbox: data.basic_inf.transmission,
				color: data.basic_inf.color,
				presentation_number: data.basic_inf.presentation_number,
				category: data.basic_inf.car_name.trim().split(' ')[0],
				primary_image: list_image_converted ? list_image_converted[0] : '',
				price_display: take_decimal_number(data.price + priceSale * data.price),

				// seller_name: data.seller.seller_name,
				// phone_contact: data.seller.phone_contact,
				// employee_number: data.seller.employee_number,
				// parking_location: data.seller.parking_location,
				// business_address: data.seller.business_address,
				// affiliated_company: data.seller.affiliated_company,

				exterior: [],
				guts: [],
				safety: [],
				convenience: data.convenience_infr,

				performance_check: [htmlToPdf],

				is_data_crawl: true,
				// Add soruce crawl data
				source_crawl: data.source_crawl
			});
		}
	} catch (error) {
		res.status(500).json({
			message: error.message,
			status_code: 500,
			error_message: req.__('Server error')
		});
	}
};
